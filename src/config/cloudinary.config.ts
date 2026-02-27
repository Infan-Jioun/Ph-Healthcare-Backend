import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../app/errorHelper/appError";
import status from "http-status";
cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_SECRET


})
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