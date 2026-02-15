import dotenv from "dotenv";
dotenv.config();
interface EnvConfig {
    NODE_ENV: string
    PORT: string
    BETTER_AUTH_URL: string
    BETTER_AUTH_SECRET: string
    DATABASE_URL: string
}
const loadEnvVariables = (): EnvConfig => {
    const requireEnvVariables = [
        "NODE_ENV",
        "PORT",
        "BETTER_AUTH_URL",
        "BETTER_AUTH_SECRET",
        "DATABASE_URL"
    ]
    requireEnvVariables.forEach((variable) => {
        if (!process.env[variable]) {
            throw new Error(`Environment variable ${variable} is required but not set in .env file`)
        }
    })
    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
    }
}
export const envVars = loadEnvVariables()