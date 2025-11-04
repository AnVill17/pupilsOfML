import { Router } from 'express';
// import downloadFile from "../controllers/diseasePrediction.js" 
// import { analyzePdf } from '../controllers/diseasePrediction.js';
import { upload } from '../middlewares/multer.middleware.js'; 
import { analyzePdf, downloadFile } from '../controllers/diseasePrediction.js';
const router = Router();
router.post("/analyze", analyzePdf);
router.get("/download", downloadFile);

export default router;
