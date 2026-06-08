import status from "http-status";
import AppError from "../../errorHelper/appError";
import { envVars } from "../../../config/env";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class LLMService {
    private apiKey: string;
    private apiUrl: string = "https://openrouter.ai/api/v1";
    private model: string;

    constructor() {
        this.apiKey = envVars.OPENROUTER_API_KEY || "";
        this.model = envVars.OPENTROUTER_LLM_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";
        if (!this.apiKey) throw new AppError(status.NOT_FOUND, "OPENROUTER_API_KEY is not set");
        if (!this.model) throw new AppError(status.NOT_FOUND, "OPENROUTER_LLM_MODEL is not set");
    }

    async generateResponse(
        prompt: string,
        context: string,        // ✅ RAGService থেকে string আসছে, array না
        asJson: boolean = false
    ): Promise<string> {
        try {
            // ✅ context সবসময় use করো, condition ছাড়া
            const fullPrompt = context
                ? `Context information:\n${context}\n\nQuestion: ${prompt}\n\nAnswer based on the context above.`
                : prompt;

            const systemMessage = asJson
                ? "You are an assistant for a healthcare management system. Respond ONLY with valid JSON. No markdown."
                : "You are a helpful assistant for a healthcare management system. Answer based on the provided context. If the context doesn't contain the answer, say you don't have enough information.";

            const bodyPayload: any = {
                model: this.model,
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: fullPrompt }
                ],
                temperature: 0.1,
                max_tokens: 1500
            };

            // ✅ OpenAI-only feature, safely add করো
            if (asJson && (this.model.includes("gpt") || this.model.includes("openai"))) {
                bodyPayload.response_format = { type: "json_object" };
            }

            // ✅ fetch টা if এর বাইরে — সবসময় call হবে
            const response = await fetch(`${this.apiUrl}/chat/completions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://healthcare-management.local",
                    "X-Title": "Healthcare Management System"
                },
                body: JSON.stringify(bodyPayload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log("LLM API error:", errorText);
                throw new AppError(
                    status.INTERNAL_SERVER_ERROR,
                    `LLM API failed. Status: ${response.status}, Body: ${errorText}`
                );
            }

            const data = await response.json();
            console.log("LLM raw response:", JSON.stringify(data, null, 2)); // ✅ temporary debug

            const content = data?.choices?.[0]?.message?.content;
            if (!content) {
                throw new AppError(status.INTERNAL_SERVER_ERROR, `Empty LLM response: ${JSON.stringify(data)}`);
            }

            return content;

        } catch (error) {
            if (error instanceof AppError) throw error;
            console.log(error);
            throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to generate answer from LLM");
        }
    }
}