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
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for demo h can increase baad me
});


const ML_SERVICE_URL = process.env.ML_SERVICE_URL ;


export const analyzePdf = asynchandler(async (req, res, next) => {
 
  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json(new ApiResponse(400, null, "File upload error"));
    }

    try {
    
      if (!req.file && req.body?.message) {
        
        const replyText = `Demo: Received message "${req.body.message}"`;
        return res.status(200).json(new ApiResponse(200, { reply: replyText }, "Chat reply"));
      }

      if (!req.file) {
        return res.status(400).json(new ApiResponse(400, null, "No file uploaded"));
      }

      const localFilePath = req.file.path;
      const originalName = req.file.originalname;

      const form = new FormData();
      form.append("file", fs.createReadStream(localFilePath), {
        filename: originalName,
      });

   
      const mlUrl = `${ML_SERVICE_URL}/api/v1/pdf/analyze`; 
      const mlResponse = await axios.post(mlUrl, form, {
        headers: {
          
          ...form.getHeaders(),
        },
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const mlData = mlResponse.data;

     
      const makeFull = (p) => {
        if (!p) return null;
        try {
        
          const maybeUrl = new URL(p);
          return maybeUrl.href;
        } catch (e) {
        
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

      
      return res.status(200).json(new ApiResponse(200, result, "PDF analysis successful"));
    } catch (error) {
      console.error("Error forwarding to ML service:", error?.response?.data || error?.message || error);
      return res.status(500).json(new ApiResponse(500, null, "Failed to analyze PDF"));
    } finally {
   
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.warn("Failed to remove temp file:", unlinkErr);
        });
      }
    }
  });
});


export const downloadFile = asynchandler(async (req, res) => {
  try {
    const fileQuery = req.query.file;
    if (!fileQuery) {
      return res.status(400).json(new ApiResponse(400, null, "Missing file query parameter"));
    }

    
    let targetUrl = "";
    if (typeof fileQuery !== "string") {
      return res.status(400).json(new ApiResponse(400, null, "Invalid file parameter"));
    }

    
    if (fileQuery.startsWith("/")) {
      targetUrl = `${ML_SERVICE_URL}${fileQuery}`;
    } else if (fileQuery.startsWith("http://") || fileQuery.startsWith("https://")) {
      targetUrl = fileQuery;
    } else {
      
      targetUrl = `${ML_SERVICE_URL}/download?file=${encodeURIComponent(fileQuery)}`;
    }

    
    const response = await axios.get(targetUrl, { responseType: "stream", timeout: 60000 });

    // Set headers from remote if available
    if (response.headers["content-type"]) res.setHeader("Content-Type", response.headers["content-type"]);
    if (response.headers["content-disposition"]) res.setHeader("Content-Disposition", response.headers["content-disposition"]);

  
    response.data.pipe(res);
  } catch (error) {
    console.error("Error downloading file from ML service:", error?.response?.data || error?.message || error);
    return res.status(500).json(new ApiResponse(500, null, "Failed to download file"));
  }
});
