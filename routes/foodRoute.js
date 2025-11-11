import express from "express";
import {
  addFood,
  listFood,
  removeFood, updateFood
} from "../controllers/foodController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/add", addFood);
router.get("/list", listFood);
router.post("/remove", removeFood);
router.post("/update", updateFood);

export default router;
