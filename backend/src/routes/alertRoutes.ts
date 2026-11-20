import express from "express";
import {
  getCategories,
  updateCategories,
} from "../controllers/alertController.js";

const router = express.Router();

router.get("/", getCategories);
router.put("/", updateCategories);

export default router;
