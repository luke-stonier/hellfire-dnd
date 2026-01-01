// REQUIRED FOR DI
import "reflect-metadata";
import dotenv from "dotenv";
import { Container } from "typedi";
import MA_APPLICATION from ".";
import path from "path";
import { ENVIRONMENT } from "./environment";

export default class Startup {
    constructor() { }

    public Build(): string {
        // configure env
        if (process.env.NODE_ENV !== "production") dotenv.config({ path: path.resolve(__dirname, "../.env") });
        
        // if (process.env.LOGSNAG == undefined) return ENVIRONMENT.LOGSNAG;
        if (process.env.REDIS_HOST == undefined) return ENVIRONMENT.REDIS_HOST;
        if (process.env.REDIS_PASSWORD == undefined) return ENVIRONMENT.REDIS_PASSWORD;
        
        // ENVIRONMENT.LOGSNAG = process.env.LOGSNAG;
        ENVIRONMENT.REDIS_HOST = process.env.REDIS_HOST;
        ENVIRONMENT.REDIS_PASSWORD = process.env.REDIS_PASSWORD;

        console.log("THIS IS DEPLOYMENT", process.env.SOURCE_VERSION);
        console.log("CONFIGURED LOGSNAG", ENVIRONMENT.LOGSNAG.substring(0, 9));

        console.log(`Startup called, running: ${process.env.ENV_NAME} :: process: ${process.pid}`);
        return "COMPLETE";
    }

    public Run(): void {
        Container.get(MA_APPLICATION);
    }
}

const startup = new Startup();
const startup_resp = startup.Build();
if (startup_resp !== "COMPLETE") {
    console.error("FAILED TO START:", startup_resp);
} else {
    startup.Run();
}
