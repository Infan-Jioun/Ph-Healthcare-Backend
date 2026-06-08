
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
            const vectorLiteral = `[${queryEmbedding.join(", ")}]`;

            const results = await prisma.$queryRaw(Prisma.sql`
            SELECT 
                id, "chunkKey", "sourceType", "sourceKey", "sourceId", 
                "sourceLabel", content, metadata, embedding,  
                "isDeleted", "createdAt", "updatedAt",
                1 - (embedding <=> CAST(${vectorLiteral} AS vector)) AS similarity 
            FROM "document_embeddings"
            WHERE "isDeleted" = false
            ${sourceType ? Prisma.sql`AND "sourceType" = ${sourceType}` : Prisma.empty} 
            ORDER BY embedding <=> CAST(${vectorLiteral} AS vector) 
            LIMIT ${limit}
        `);

            return results;

        } catch (error) {
            console.log("Error retrieving documents:", error);
            return [];
        }
    }

    async generateAnswer(query: string, limit: number = 5, sourceKeys?: string, asJson: boolean = false) {
        try {
            const releventDocs = await this.retiveRelevantDocuments(query, limit, sourceKeys);


            if (!Array.isArray(releventDocs) || releventDocs.length === 0) {
                return {
                    answer: "No relevant documents found.",
                    sources: [],
                    contextUsed: false
                };
            }

            const context = (releventDocs as any[])
                .filter((doc: any) => doc.content)
                .map((doc: any) => doc.content)
                .join("\n\n");

            let answer = await this.llmService.generateResponse(query, context);
            if (!answer || typeof answer !== "string") {
                console.log("LLM returned empty/invalid response:", answer);
                return {
                    answer: "Could not generate an answer.",
                    sources: [],
                    contextUsed: false
                };
            }

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
                sources: (releventDocs as any[]).map((doc: any) => ({
                    id: doc.id,
                    chunkKey: doc.chunkKey,
                    sourceType: doc.sourceType,
                    sourceId: doc.sourceId,
                    sourceLabel: doc.sourceLabel,
                    content: doc.content,
                    similarity: doc.similarity
                })),
                contextUsed: context.length > 0
            };

        } catch (error) {
            console.log("Error generating answer: ", error);
            throw error;
        }
    }
    async getStats() {
        try {
            const totalActiveDocuments = await prisma.$queryRaw(Prisma.sql`
            SELECT COUNT(*) as count FROM "document_embeddings" WHERE "isDeleted" = false
        `);

            const sourceTypeCounts = await prisma.$queryRaw(Prisma.sql`
            SELECT "sourceType", COUNT(*) as count 
            FROM "document_embeddings" 
            WHERE "isDeleted" = false 
            GROUP BY "sourceType"
        `);

            //     const recentDocuments = await prisma.$queryRaw(Prisma.sql`
            //     SELECT "id", "chunkKey", "sourceType", "sourceLabel", "createdAt"
            //     FROM "document_embeddings"
            //     WHERE "isDeleted" = false
            //     ORDER BY "createdAt" DESC
            //     LIMIT 10
            // `);

            return {
                totalActiveDocuments: Number((totalActiveDocuments as any[])[0]?.count ?? 0),
                sourceTypeBreakdown: (sourceTypeCounts as any[]).reduce((acc: any, curr: any) => {
                    acc[curr.sourceType] = Number(curr.count);
                    return acc;
                }, {}),

            };


        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}