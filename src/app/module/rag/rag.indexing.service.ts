import { prisma } from "../../lib/prisma"
import { EmbeddingService } from "./rag.embeddingService"

export class IndexingService {
    private embeddingService: EmbeddingService
    constructor() {
        this.embeddingService = new EmbeddingService()
    }
    async indexDoctorData() {
        try {
            console.log("Fetching doctor data for indexing")
            const doctors = await prisma.doctor.findMany({
                where: { isDeleted: false },
                include: {
                    specialities: {
                        include: {
                            speciality: true
                        }
                    },
                    reviews: true
                }
            })
            let indexingCount = 0
            //** Format Specialities */
            for (const doctor of doctors) {
                const speaciliaties = doctor.specialities.map((ds) => ds.speciality.title).join("\n")
                //** Format Reviews */
                const reviewsText = doctor.reviews.map((r) => `- Rating: ${r.rating}/5. Comment: ${r.comment || "No Comment"}`);

                const content = `Doctor Name: ${doctor.name}
                Experience: ${doctor.experience} years
                Qualification: ${doctor.qualification}
                Designation: ${doctor.designation}
                Appointment Fee: $${doctor.appointmentFee}
                Current Working Place: ${doctor.currentWorkingPlace}
                Average Rating: ${doctor.averageRating}/5
                Specialties: ${speaciliaties || "None listed"}

                Patient Reviews:
                ${reviewsText || "No reviews yet."}`;
                const metaData = {
                    doctorId: doctor.id,
                    name: doctor.name,
                    speaciliaties: doctor.specialities.map((ds) => ds.speciality.title),
                    averageRating: doctor.averageRating,
                    experinence: doctor.experience
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
}