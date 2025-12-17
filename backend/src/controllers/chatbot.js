import { ApiResponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import axios from "axios";
import { gemini, gemini2 } from "./geminiapi.js";

const chatbot = asynchandler(async (req, res) => {
  try {
    // ✅ Get crop data from request body
    const userAsk = req.body;

    
    const predictionResponse = await axios.post(
      "https://crop-prediction-api-0bj5.onrender.com/predict",//will put in env file but for demo its here!!
      cropData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if(!predictionResponse)
      console.log("error fetching msg");
      
//     const prediction = "rice"; // hardcoded for demo purposes
//  // hardcoded for demo purposes
    console.log("External API response data:", predictionResponse);

  
    const result = {
      response:predictionResponse,
     
    };

    
    return res
      .status(200)
      .json(new ApiResponse(200, result, "user reposnse sent"));
  } catch (error) {
    
    console.error("Error fetching prediction from ML service:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to get crop prediction."));
  }
});

export default chatbot;
