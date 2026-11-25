import express from "express";
import { getListings, postListing } from "../controllers/listingController.js";

const router = express.Router();

router.get("/", getListings);
router.post("/", postListing);

export default router;
