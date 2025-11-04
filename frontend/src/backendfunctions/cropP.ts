import axios, { AxiosResponse } from "axios";

export interface ChatResponse {
  reply: string; // backend’s response message
}

interface ApiResponseShape<T = any> {
  statusCode: number;
  data: T | null;
  message: string;
}

export async function sendMessageToBackend(message: string): Promise<ChatResponse> {
  try {
    const response: AxiosResponse<ApiResponseShape> = await axios.post(
      "/api/v1/crops/predict", // or /api/v1/chat if you separate endpoints
      { message },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
    );

    // unwrap ApiResponse: prefer data.reply, or fallback to message
    const apiData = response.data?.data;
    let reply = "";

    if (apiData) {
      if (typeof apiData === "string") {
        reply = apiData;
      } else if (typeof apiData.reply === "string") {
        reply = apiData.reply;
      } else if (apiData.crop) {
        // If backend returned crop prediction, create a readable reply
        reply = `Result: ${apiData.crop}`;
        if (apiData.info) reply += ` — ${apiData.info}`;
      } else {
        reply = response.data.message || "No reply content.";
      }
    } else {
      // No data object, fallback to ApiResponse.message
      reply = response.data?.message || "No reply from server.";
    }

    return { reply };
  } catch (error: any) {
    console.error("Error communicating with backend:", error?.response?.data || error?.message);
    // Provide a friendly user-facing fallback
    return { reply: "⚠️ Error: Unable to get response from server." };
  }
}
