import { createClient, RedisClientType } from "redis";
import { envVars } from "../../config/env";
import AppError from "../errorHelper/appError";
import status from "http-status";

class RedisService {
    private client: RedisClientType | null = null
    private isConnected: boolean = false
    async connect(): Promise<void> {
        try {
            const redisUrl = envVars.REDIS_URL;
            this.client = createClient({ url: redisUrl });
            //! Handle conecctions events 
            this.client.on("error", (err) => {
                console.log("Redis Client Error", err)
            })
            this.client.on("connect", () => {
                console.log("Redis Client Connected");
                this.isConnected = true
            })
            this.client.on("ready", () => {
                console.log("Redis Client Ready");
                this.isConnected = true
            })
            this.client.on("end", () => {
                console.log("Redis Client Disconnected")
            })
            this.client.on("reconnecting", () => {
                console.log("Redis Client Reconnecting")
            })
            await this.client.connect()
        } catch (error) {
            console.log(error)
        }
    }
    private ensureConnection(): RedisClientType {
        if (!this.client) {
            throw new AppError(status.CONFLICT, "Redis client not initialzed. Call connect() first")
        }
        if (!this.connect) {
            throw new AppError(status.CONFLICT, "Redis is not connected")
        }
        return this.client
    }

}
export const redisService = new RedisService();