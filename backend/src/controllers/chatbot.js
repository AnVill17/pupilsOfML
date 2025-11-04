import { ApiResponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/AsyncHandler.js";
import axios from "axios";
import { gemini, gemini2 } from "./geminiapi.js";

const chatbot = asynchandler(async (req, res) => {
  try {
    // ✅ Get crop data from request body
    const cropData = req.body;

    // ✅ Call external ML prediction API
   //  const predictionResponse = await axios.post(
   //    "https://crop-prediction-api-0bj5.onrender.com/predict",
   //    cropData,
   //    {
   //      headers: { "Content-Type": "application/json" },
   //    }
   //  );

    // ✅ Extract the predicted crop (adjust key if API changes)
   //  const prediction = predictionResponse.data["Predicted Crop"];
    const prediction = "rice"; // hardcoded for demo purposes
 // hardcoded for demo purposes
    console.log("External API response data:", prediction);

    // ✅ Optional: Call Gemini for more info about the predicted crop
    // const geminiResponse = await gemini(prediction);

    // ✅ Build the final result object
    const result = {
      crop: prediction,
      // info: geminiResponse, // uncomment if Gemini is active
    };

    // ✅ Send back structured response
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Crop prediction successful"));
  } catch (error) {
    // ✅ Log and return a clean error message
    console.error("Error fetching prediction from ML service:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to get crop prediction."));
  }
});

export default chatbot;
