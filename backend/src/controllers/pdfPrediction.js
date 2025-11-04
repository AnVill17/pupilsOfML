// controllers/pdfController.js
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import multer from "multer";
import { ApiResponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";

const upload = multer({
  dest: path.join(process.cwd(), "tmp", "uploads"),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit (adjust)
});

// ML service base URL (set in .env)
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "https://your-ml-service.example.com";

/**
 * Controller wrapper that first runs Multer to accept single file upload
 * then forwards it to ML service and returns the ML response to client.
 *
 * Route: POST /api/v1/pdf/analyze
 * form field: file
 */
export const analyzePdf = asynchandler(async (req, res, next) => {
  // Use multer middleware programmatically to handle single file upload
  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json(new ApiResponse(400, null, "File upload error"));
    }

    try {
      // If client sent a JSON-style chat message instead of file, handle that too
      if (!req.file && req.body?.message) {
        // Example demo reply — you can call your gemini or other LLM here
        const replyText = `Demo: Received message "${req.body.message}"`;
        return res.status(200).json(new ApiResponse(200, { reply: replyText }, "Chat reply"));
      }

      if (!req.file) {
        return res.status(400).json(new ApiResponse(400, null, "No file uploaded"));
      }

      const localFilePath = req.file.path;
      const originalName = req.file.originalname;

      // Create FormData and append the file stream
      const form = new FormData();
      form.append("file", fs.createReadStream(localFilePath), {
        filename: originalName,
      });

      // Add any other fields if your ML service expects them (example)
      // form.append("metadata", JSON.stringify({ source: "web" }));

      // Forward file to ML service
      const mlUrl = `${ML_SERVICE_URL}/api/v1/pdf/analyze`; // change path to ML's analyze endpoint
      const mlResponse = await axios.post(mlUrl, form, {
        headers: {
          // form.getHeaders() includes proper multipart boundary
          ...form.getHeaders(),
        },
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      // ML response expected to be JSON similar to:
      // { "csv_download": "/download?file=....csv", "json_download": "...", "num_records": 0, "preview":[], "status":"ok" }
      const mlData = mlResponse.data;

      // Build full URLs for the frontend to use for download.
      // If the ML service returns paths that are relative to its origin, we create absolute URLs.
      // Example: if mlData.csv_download === "/download?file=abc.csv", we make ML_SERVICE_URL + path
      const makeFull = (p) => {
        if (!p) return null;
        try {
          // If p is already a full URL, return as-is
          const maybeUrl = new URL(p);
          return maybeUrl.href;
        } catch (e) {
          // relative path -> prefix with ML_SERVICE_URL
          return `${ML_SERVICE_URL}${p}`;
        }
      };

      const result = {
        csv_download: makeFull(mlData.csv_download),
        json_download: makeFull(mlData.json_download),
        num_records: mlData.num_records ?? null,
        preview: mlData.preview ?? null,
        raw: mlData,
      };

      // send structured response back
      return res.status(200).json(new ApiResponse(200, result, "PDF analysis successful"));
    } catch (error) {
      console.error("Error forwarding to ML service:", error?.response?.data || error?.message || error);
      return res.status(500).json(new ApiResponse(500, null, "Failed to analyze PDF"));
    } finally {
      // Clean up temporary uploaded file
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.warn("Failed to remove temp file:", unlinkErr);
        });
      }
    }
  });
});

/**
 * GET /api/v1/pdf/download?file=<path-or-filename>
 * This endpoint proxies/streams files from ML service to the client.
 *
 * Example usage:
 *  - If ML service serves files at https://ml-host/download?file=abc.csv
 *  - client calls /api/v1/pdf/download?file=/download?file=abc.csv  OR file=abc.csv
 *
 * Implementation tries to support:
 *  - direct filename query: ?file=abc.csv (we call ML_SERVICE_URL + /download?file=abc.csv)
 *  - or full path query that already includes /download?file=...
 */
export const downloadFile = asynchandler(async (req, res) => {
  try {
    const fileQuery = req.query.file;
    if (!fileQuery) {
      return res.status(400).json(new ApiResponse(400, null, "Missing file query parameter"));
    }

    // Build ML URL
    let targetUrl = "";
    if (typeof fileQuery !== "string") {
      return res.status(400).json(new ApiResponse(400, null, "Invalid file parameter"));
    }

    // If fileQuery looks like a path starting with "/download", use directly; else prefix
    if (fileQuery.startsWith("/")) {
      targetUrl = `${ML_SERVICE_URL}${fileQuery}`;
    } else if (fileQuery.startsWith("http://") || fileQuery.startsWith("https://")) {
      targetUrl = fileQuery;
    } else {
      // assume file name -> ML endpoint /download?file=<name>
      targetUrl = `${ML_SERVICE_URL}/download?file=${encodeURIComponent(fileQuery)}`;
    }

    // Proxy the file stream
    const response = await axios.get(targetUrl, { responseType: "stream", timeout: 60000 });

    // Set headers from remote if available
    if (response.headers["content-type"]) res.setHeader("Content-Type", response.headers["content-type"]);
    if (response.headers["content-disposition"]) res.setHeader("Content-Disposition", response.headers["content-disposition"]);

    // Pipe remote stream to client
    response.data.pipe(res);
  } catch (error) {
    console.error("Error downloading file from ML service:", error?.response?.data || error?.message || error);
    return res.status(500).json(new ApiResponse(500, null, "Failed to download file"));
  }
});
