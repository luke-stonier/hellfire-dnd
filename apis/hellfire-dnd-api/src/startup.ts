// REQUIRED FOR DI
import "reflect-metadata";
import dotenv from "dotenv";
import { Container } from "typedi";
import APPLICATION from ".";
import path from "path";
import { ENVIRONMENT } from "./environment";

console.log('####################################################')
console.log('-------------------- STARTUP -----------------------')
console.log('####################################################')

export default class Startup {
    constructor() { }

    public Build(): string {
        // configure env
        if (process.env.NODE_ENV !== "production") {
            dotenv.config({
                path: path.resolve(__dirname, "../../.env"),
                quiet: true
            });
        }
        
        console.log('redis disabled, to enable update startup.ts')
        // if (process.env.REDIS_HOST == undefined) return ENVIRONMENT.REDIS_HOST;
        // if (process.env.REDIS_PASSWORD == undefined) return ENVIRONMENT.REDIS_PASSWORD;
        
        // ENVIRONMENT.REDIS_HOST = process.env.REDIS_HOST;
        // ENVIRONMENT.REDIS_PASSWORD = process.env.REDIS_PASSWORD;

        if (process.env.NODE_ENV === 'production') console.log("THIS IS DEPLOYMENT", process.env.SOURCE_VERSION);
        console.log(`Running: ${process.env.ENV_NAME} :: process: ${process.pid}`);
        return "COMPLETE";
    }

    public Run(): void {
        Container.get(APPLICATION);
    }
}

const startup = new Startup();
const startup_resp = startup.Build();
if (startup_resp !== "COMPLETE") {
    console.error("FAILED TO START:", startup_resp);
} else {
    startup.Run();
}
