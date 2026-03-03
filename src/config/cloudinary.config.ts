import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../app/errorHelper/appError";
import status from "http-status";
cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_SECRET


})
export const uploadFileToCloudinary = async (buffer: Buffer, filename: string)
    : Promise<UploadApiResponse> => {
    if (!buffer || !filename) {
        throw new AppError(status.BAD_REQUEST, "File buffer and filename are required for upload");
    }

    const extension = filename.split(".").pop()?.toLocaleLowerCase();

    const fileNameWithoutExtension = filename
        .split(".")
        .slice(0, -1)
        .join(".")
        .toLowerCase()
        .replace(/\s+/g, "-")
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-]/g, "");

    const uniqueName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileNameWithoutExtension;

    const folder = extension === "pdf" ? "pdfs" : "images";
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                public_id: `ph-healthcare/${folder}/${uniqueName}`,
                folder: `ph-healthcare/${folder}`
            },
            (error, result) => {
                if (error) {
                    return reject(new AppError(status.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"))
                };
                resolve(result as UploadApiResponse)
            }
        ).end(buffer)
    })

}
export const deleteFileFromCloudinary = async (url: string) => {
    try {
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^/.]+$/;
        const match = url.match(regex);
        if (match && match[1]) {
            const publicId = match[1];
            await cloudinary.uploader.destroy(
                publicId, {
                resource_type: "image"
            }
            )
            console.log(`File ${publicId} deleted from cloudinary`);
        }
    } catch (error) {
        console.log(error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Internal server error please try again")
    }
}
export const cloudinaryUpload = cloudinary;