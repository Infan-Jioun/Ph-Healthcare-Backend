import status from "http-status";
import { envVars } from "../../../config/env";
import AppError from "../../errorHelper/appError";

export class EmbeddingService {
    private apiKey: string;
    private apiUrl: string = "https://openrouter.ai/api/v1";
    private embeddingModel: string;
    constructor() {
        this.apiKey = envVars.OPENROUTER_API_KEY || "";
        this.embeddingModel = envVars.OPENROUTER_EMBEDDING_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";
        if (!this.apiKey) {
            throw new AppError(status.NOT_FOUND, "OPENROUTER_API_KEY is not set");
        }
        if (!this.embeddingModel) {
            throw new AppError(status.NOT_FOUND, "OPENROUTER_EMBEDDING_MODEL is not set");
        }
    }
}