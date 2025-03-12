import { Router } from "express";
import {
  addSnippet,
  getSnippets,
  getSnippetById,
  updateSnippet,
} from "../controllers/snippetControllers";
const router = Router();

router.post("/", addSnippet);
router.get("/", getSnippets);
router.get("/:id", getSnippetById);
router.put("/:id", updateSnippet);

export default router;
