// import { Router } from "express";
// import { upload } from "../middlewares/multer.middleware.js";
// import chatbot from "../controllers/chatbot.js";

// const router= Router()
// router.route("/predict").post(upload.single("soilTest"), chatbot);
// src/routes/chatbot.routes.js

import { Router } from "express";
import chatbot from "../controllers/chatbot.js";

const router = Router();

router.route("/predict").post(chatbot);

export default router;