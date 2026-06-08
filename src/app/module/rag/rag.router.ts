import express, { Router } from "express";
import { RAGController } from "./rag.controller";
const router = express.Router();
router.post("/ingest-doctor", RAGController.ingestDoctor);
router.post("/query", RAGController.queryRag)
router.get("/stats", RAGController.getStats)

export const ragRouter: Router = router;