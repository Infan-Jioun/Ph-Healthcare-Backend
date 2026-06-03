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
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const response = await fetch(`${this.apiUrl}/embeddings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.embeddingModel,
                    input: text
                })
            })
            if (!response.ok) {
                throw new AppError(status.INTERNAL_SERVER_ERROR, `Failed to generate embedding. Status: ${response.status}, Message: ${await response.text()}`);
            }
            const data = await response.json();
            if (!data.data || data.data.length === 0) {
                throw new AppError(status.INTERNAL_SERVER_ERROR, "Invalid response format from embedding API");
            }
            return data.data[0].embedding;
        } catch (error) {
            console.log("Error generating embedding:", error);
            throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to generate embedding");
        }
    }
}