import { Router } from "express";
import {
  addSnippet,
  getSnippets,
  getSnippetById,
} from "../controllers/snippetControllers";
const router = Router();

router.post("/", addSnippet);
router.get("/", getSnippets);
router.get("/:id", getSnippetById);

export default router;
