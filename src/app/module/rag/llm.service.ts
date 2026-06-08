import status from "http-status";
import { envVars } from "../../../config/env";
import AppError from "../../errorHelper/appError";

export class LLMService {
    private apiKey: string;
    private apiUrl: string = "https://openrouter.ai/api/v1";
    private model: string
    constructor() {
        this.apiKey = envVars.OPENROUTER_API_KEY || "";
        this.model = envVars.OPENTROUTER_LLM_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";
        if (!this.apiKey) {
            throw new AppError(status.NOT_FOUND, "OPENROUTER_API_KEY is not set");
        }
        if (!this.model) {
            throw new AppError(status.NOT_FOUND, "OPENROUTER_LLM_MODEL is not set");
        }
    }
} 