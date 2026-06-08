
import { Prisma } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { EmbeddingService } from "./rag.embedding.service"

// const toVectorLiteral = (vector: number[]) => {
//     return `[${vector.join(", ")}]`
// }

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
            const vectorLiteral = `[${embedding.join(",")}]`;

            await prisma.$executeRaw(Prisma.sql`
            INSERT INTO "document_embeddings" (
                "id",
                "chunkKey",
                "sourceKey",
                "sourceType",
                "sourceId",
                "sourceLabel",
                "content",
                "embedding",
                "metadata",
                "updatedAt"
            ) VALUES (
                gen_random_uuid(),
                ${chunkKey},
                ${sourceKey},
                ${sourceKey},
                ${sourceId},
                ${sourceLabel ?? null},
                ${content},
                ${Prisma.raw(`'${vectorLiteral}'::vector`)},
                ${JSON.stringify(metaData ?? {})}::jsonb,
                NOW()
            )
            ON CONFLICT ("chunkKey") DO UPDATE SET
                "sourceKey" = EXCLUDED."sourceKey",
                "sourceType" = EXCLUDED."sourceType",
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


}