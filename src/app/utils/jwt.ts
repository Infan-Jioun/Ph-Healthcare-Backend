/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
const createToken = (payload: JwtPayload, secret: string, { expiresIn }: SignOptions) => {
    const token = jwt.sign(payload, secret, { expiresIn })
    return token;
};
const verifyToken = (token: string, secret: string) => {
    try {
        const deocoded = jwt.verify(token, secret) as JwtPayload;
        return {
            success: true,
            data: deocoded
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            error
        }
    }
};
const decodeToken = () => { }