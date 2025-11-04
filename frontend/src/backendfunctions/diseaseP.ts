// src/backendfunctions/pdfAnalysis.ts
import axios, { AxiosResponse } from "axios";

export async function analyzePdf(file: File, onProgress?: (percent: number) => void): Promise<string[][]> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response: AxiosResponse<any> = await axios.post("/api/v1/pdf/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
      responseType: "arraybuffer" // allow receiving file data; we will inspect content-type
    });

    // Determine content-type returned by server
    const contentType = response.headers["content-type"] || "";

    // Case A: backend returned a CSV file (text/csv)
    if (contentType.includes("text/csv") || contentType.includes("application/csv")) {
      // Convert arraybuffer to string
      const decoder = new TextDecoder("utf-8");
      const csvText = decoder.decode(response.data);
      return parseCsv(csvText);
    }

    // Case B: backend returned JSON (axios parsed it into arraybuffer because responseType was arraybuffer).
    // try to decode and parse JSON
    try {
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(response.data);
      const json = JSON.parse(text);

      // Common formats:
      // { data: { csv: "a,b\nc,d" } } or { data: [["a","b"],["c","d"]] } or { csv: "..." }
      const payload = json?.data ?? json;

      if (typeof payload === "string") {
        return parseCsv(payload);
      } else if (Array.isArray(payload)) {
        // Already array of arrays
        return payload as string[][];
      } else if (typeof payload?.csv === "string") {
        return parseCsv(payload.csv);
      } else if (typeof payload?.result === "string") {
        return parseCsv(payload.result);
      }

      throw new Error("Unexpected JSON response shape");
    } catch (jsonErr) {
      // If we failed to parse JSON, try to decode as text and parse as CSV fallback
      try {
        const decoder = new TextDecoder("utf-8");
        const csvText = decoder.decode(response.data);
        return parseCsv(csvText);
      } catch (finalErr) {
        throw new Error("Unable to parse server response as CSV or JSON");
      }
    }
  } catch (err: any) {
    // Provide helpful error propagation
    const msg = err?.response?.data?.message || err?.message || "Upload failed";
    throw new Error(msg);
  }
}

/**
 * Basic CSV parser that handles quoted fields and commas inside quotes.
 * Not a full RFC4180 parser but good for typical generated CSVs.
 */
export function parseCsv(csvText: string): string[][] {
  const rows: string[][] = [];
  let cur = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    const nxt = csvText[i + 1];

    if (ch === '"' ) {
      if (inQuotes && nxt === '"') {
        // Escaped double quote
        cur += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      row.push(cur);
      cur = "";
      continue;
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      // handle CRLF (\r\n)
      if (ch === '\r' && csvText[i + 1] === '\n') {
        i++;
      }
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
      continue;
    }

    cur += ch;
  }

  // push leftover
  if (cur !== "" || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }

  // Remove possible trailing empty row (common if CSV ends with newline)
  if (rows.length > 0 && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") {
    rows.pop();
  }

  return rows;
}
