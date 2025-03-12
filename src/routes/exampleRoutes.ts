import { Router } from "express";
import { getHelloWorld } from "../controllers/exampleController";
const router = Router();

router.get("/test", getHelloWorld);

export default router;
