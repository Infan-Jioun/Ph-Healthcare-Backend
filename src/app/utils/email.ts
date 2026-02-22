import { envVars } from "../../config/env";
import nodemailler from "nodemailer";
const transporter = nodemailler.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT)
})
// ! Email Sending 
interface SendEmailOptions {
    to: string,
    subject: string,
    templateName: string,
    templateData: string,
    attachments?: {
        filename: string,
        content: string,
        contentType: string
    }
}