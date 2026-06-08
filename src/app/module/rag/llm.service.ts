/* eslint-disable @typescript-eslint/no-explicit-any */
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
    async generateAnswer(prompt: string, query: string, context: string[] = [], asJson: boolean = false) {
        try {
            //* Combind context with prompt for RAG
            let fullPrompt = context.length > 0 ? `Context information:\n${context.join("\n/n")}\n\nQuestion : {prompt}\n\nAnswer based on the conext above.` : prompt;
            if (asJson) {
                fullPrompt += `\n\nReturn ONLY a valid JSON obeject matching this structure: {"doctors" : ["name", "Doctor Name", "reason": "Why they are suitable", "speaciality]}. Do not include any markdown formatting like \`\`\`josn`

            }
            const systemMessage = asJson ?
                "You are assistent for a healthcare management system. Answer question bassed on the provided context. You Must respond with only valid JSON format. Do not include markdown tags."
                :
                "You are a helpful assistent for a healthcare management system. Answer questions based on the provided context. If the context does not contain the answer, say you don't have enough information";
            const bodyPayload: any = {
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: systemMessage
                    },
                    {
                        role: "user",
                        content: fullPrompt
                    }

                ],
                temperature: 0.1, //! Lower temperature for more deterministic answers, especially important for RAG scenarios
                max_tokens: 1500
            };
            if (asJson && (this.model.includes("gpt") || this.model.includes("openai"))) {
                bodyPayload.response_format = {
                    type: "json_object"
                };
                const response = await fetch(`${this.apiUrl}/chat/completions`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://healthcare-management.local",
                        "X-Title": "Healthcare Management System"

                    },
                    body: JSON.stringify(bodyPayload)

                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.log("LLM API error response: ", errorText);
                    throw new AppError(status.INTERNAL_SERVER_ERROR, `Failed to generate answer from LLM. Status: ${response.status}, Message: ${errorText}`);
                }
                const data = await response.json();
                return data.choices[0].message.content;
            }
        } catch (error) {
            console.log(error);
            throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to generate answer from LLM");
        }
    }
} 