/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { EmbeddingService } from "./rag.embedding.service"

const toVectorLiteral = (vector: number[]) => {
    return `[${vector.join(", ")}]`
}

export class IndexingService {
    private embeddingService: EmbeddingService
    constructor() {
        this.embeddingService = new EmbeddingService()
    }

    async indexDocument(
        chunkKey: string,
        sourceKey: string,
        sourceId: string,
        content: string,
        sourceLabel?: string,
        metaData?: Record<string, unknown>
    ) {
        try {
            const embedding = await this.embeddingService.generateEmbedding(content);
            const vectorLiteral = toVectorLiteral(embedding);

            await prisma.$executeRaw(Prisma.sql`
                INSERT INTO "document_embeddings" (
                    "id",
                    "chunkKey",
                    "sourceKey",
                    "sourceId",
                    "sourceLabel",
                    "content",
                    "embedding",
                    "metadata",
                    "updatedAt"
                ) VALUES (
                    ${Prisma.raw("gen_random_uuid()")},
                    ${chunkKey},
                    ${sourceKey},
                    ${sourceId},
                    ${sourceLabel || null},
                    ${content},
                    CAST(${vectorLiteral} AS vector),
                    ${JSON.stringify(metaData || {})}::jsonb,
                    NOW()
                )
                ON CONFLICT ("chunkKey") DO UPDATE SET
                    "sourceKey" = EXCLUDED."sourceKey",
                    "sourceId" = EXCLUDED."sourceId",
                    "content" = EXCLUDED."content",
                    "embedding" = EXCLUDED."embedding",
                    "metadata" = EXCLUDED."metadata",
                    "isDeleted" = false,
                    "deletedAt" = null,
                    "updatedAt" = NOW()
            `);

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async indexDoctorData() {
        try {
            console.log("Fetching doctor data for indexing")
            const doctors = await prisma.doctor.findMany({
                where: { isDeleted: false },
                include: {
                    specialities: {
                        include: { speciality: true }
                    },
                    reviews: true
                }
            })

            let indexingCount = 0

            for (const doctor of doctors) {
                const specialties = doctor.specialities.map((ds) => ds.speciality.title).join("\n")
                const reviewsText = doctor.reviews
                    .map((r) => `- Rating: ${r.rating}/5. Comment: ${r.comment || "No Comment"}`)
                    .join("\n")

                const content = `Doctor Name: ${doctor.name}
Experience: ${doctor.experience} years
Qualification: ${doctor.qualification}
Designation: ${doctor.designation}
Appointment Fee: $${doctor.appointmentFee}
Current Working Place: ${doctor.currentWorkingPlace}
Average Rating: ${doctor.averageRating}/5
Specialties: ${specialties || "None listed"}

Patient Reviews:
${reviewsText || "No reviews yet."}`

                const metaData = {
                    doctorId: doctor.id,
                    name: doctor.name,
                    specialities: doctor.specialities.map((ds) => ds.speciality.title),
                    averageRating: doctor.averageRating,
                    experience: doctor.experience
                }

                const chunkKey = `doctor-${doctor.id}`

                await this.indexDocument(
                    chunkKey,
                    "DOCTOR",        // ✅ sourceKey
                    doctor.id,
                    content,
                    doctor.name,     // ✅ sourceLabel
                    metaData
                )
                indexingCount++     // ✅ loop এর ভেতরে নেওয়া হয়েছে
            }

            console.log(`Indexed ${indexingCount} doctor records successfully.`)
            return {
                success: true,
                message: `Indexed ${indexingCount} doctor records successfully.`,
                indexingCount
            }
        } catch (error) {
            console.log(error)
            throw error
        }
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
        {
            try {
                const releventDocs = await this.retiveRelevantDocuments(query, limit, sourceKeys);
                //* Extract content from documents  for context 
                const context = releventDocs.filter((doc: any) => doc.content).map((doc : any) => doc.content);
                let annswer = await this.llmService.
            }
            catch (error) {
                console.log("Error generating answer: ", error)
                throw error
            }
        }

    }
}