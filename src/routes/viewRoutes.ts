import express from "express";
import { renderItemsView } from "../controllers/viewControllers";

const router = express.Router();

router.get("/dashboard", renderItemsView);

export default router;
