import app from "./app";
import { redisService } from "./app/lib/redis";
import { envVars } from "./config/env";

const boostrap = async () => {
    try {
        await redisService.connect();
        app.listen(envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });

    } catch (error) {
        console.log("Failed  to start server : ", error);
    }
}
boostrap();