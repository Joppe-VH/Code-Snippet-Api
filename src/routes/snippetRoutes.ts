import { Router } from "express";
import { addSnippet, getSnippets } from "../controllers/snippetControllers";
const router = Router();

router.post("/", addSnippet);
router.get("/", getSnippets);

export default router;
