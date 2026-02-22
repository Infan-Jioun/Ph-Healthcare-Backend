/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../../config/env";
import nodemailler from "nodemailer";
import path from "node:path";
import ejs from 'ejs';
import AppError from "../errorHelper/appError";
import status from "http-status";
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
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, any>;
    attachments?: {
        filename: string,
        content: string,
        contentType: string
    }[]
}
export const email = async ({ subject, templateData, templateName, to, attachments }: SendEmailOptions) => {
    try {
        const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData);
        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FORM,
            subject: subject,
            to: to,
            html: html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: typeof attachment.contentType === 'string' ? attachment.contentType : undefined
            }))
        })
        console.log(`Email send to ${to} : ${info.messageId} `);
    } catch (error) {
        console.error("Email Sending failed", error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");


    }
}
