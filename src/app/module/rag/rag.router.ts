import express, { Router } from "express";
import { RAGController } from "./rag.controller";
const router = express.Router();
router.post("/ingest-doctor", RAGController.ingestDoctor);
export const ragRouter: Router = router;