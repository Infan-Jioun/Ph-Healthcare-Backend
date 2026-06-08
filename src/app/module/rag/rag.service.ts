
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { LLMService } from "./llm.service";
import { EmbeddingService } from "./rag.embedding.service";
import { IndexingService } from "./rag.indexing.service";

export class RAGService {
    private embeddingService: EmbeddingService;
    private llmService: LLMService;
    private indexingService: IndexingService;
    constructor() {
        this.embeddingService = new EmbeddingService();
        this.llmService = new LLMService();
        this.indexingService = new IndexingService();
    }

    async ingestDoctorData() {
        return await this.indexingService.indexDoctorData()
    }

    async retiveRelevantDocuments(query: string, limit: number = 5, sourceType?: string) {
        try {
            const queryEmbedding = await this.embeddingService.generateEmbedding(query);
            const vectorLiteral = `[${queryEmbedding.join(", ")}]`
            const results = await prisma.$queryRaw(Prisma.sql`
                SELECT id, "chunkKey" , "sourceType", "sourceKey", "sourceId", "sourceLabel", content, metadata,ebbedding, "isDeleted", "createdAt", "updatedAt", 1 - (embedding <=> CAST(${vectorLiteral} AS vector)) AS similarity 
                                FROM "document_embeddings"
                                WHERE "isDeleted" = false
                                ${sourceType ? Prisma.sql`AND "sourceType" = 
                                ${sourceType}` : Prisma.empty} ORDER BY embedding <=> CAST(${vectorLiteral} AS vector) LIMIT ${limit};
                `)
            return results
        } catch (error) {
            console.log(error)
        }
    }
    async generateAnswer(query: string, limit: number = 5, sourceKeys?: string, asJson: boolean = false) {
        try {
            const releventDocs = await this.retiveRelevantDocuments(query, limit, sourceKeys);

            const context = (releventDocs as any)
                .filter((doc: any) => doc.content)
                .map((doc: any) => doc.content)
                .join("\n\n");

            let answer = await this.llmService.generateResponse(query, context);
            let parsedAnswer: any = answer;

            if (asJson) {
                try {
                    if (answer.startsWith("```json")) {
                        answer = answer.replace(/```json\n?/, "").replace(/```$/, "").trim();
                    } else if (answer.startsWith("```")) {
                        answer = answer.replace(/```\n?/, "").replace(/```$/, "").trim();
                    }
                    parsedAnswer = JSON.parse(answer);
                } catch (error) {
                    console.log("JSON parse error:", error);
                }
            }

            return {
                answer: parsedAnswer,
                sources: (releventDocs as any).map((doc: any) => ({
                    id: doc.id,
                    chunkKey: doc.chunkKey,
                    sourceType: doc.sourceType,
                    sourceId: doc.sourceId,
                    sourceLabel: doc.sourceLabel,
                    conetent: doc.content,
                    similariity: doc.similariity
                })),
                contextUsed: context.length > 0
            };
        } catch (error) {
            console.log("Error generating answer: ", error);
            throw error;
        }
    }
}