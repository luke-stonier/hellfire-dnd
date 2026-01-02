import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { Service } from "typedi";
import MainControllers from "./controllers/MainControllers";
import DatabaseService from "./services/DatabaseService";
import sslRedirect from "heroku-ssl-redirect";
import RedisService from "./services/RedisService";
import path from "path";
import multer from "multer";
const contextService = require("request-context");
const bodyParser = require('body-parser');

/*
  Main application that handles the app.
  The startup.ts file is called from the command line and registers all
  of the DI, then hits here
*/
@Service()
export default class APPLICATION {
    // express application
    private app: Application = express();
    private PORT = process.env.PORT || 5000;

    // Called after DI is set up from the startup.ts file
    constructor(
        private databaseService: DatabaseService,
        private mainControllers: MainControllers,
        private RedisService: RedisService
    ) {
        this.Configure();
    }

    /* Sets up the express server and starts the registering of endpoints */
    private Configure(): void {
        // Setup connection to database
        this.databaseService.Connect(() => this.SetupExpress());
        this.RedisService.setupRedis();
    }

    private SetupExpress(): void {
        console.log("Configuration complete, continuing startup process");

        // Force https routing
        this.app.use(sslRedirect());
        // Enable cors with no restrictions
        this.app.use(cors());
        // enable json parsing
        const storage = multer.memoryStorage();
        const upload = multer({
            storage: storage, limits: { fileSize: 50 * 1024 * 1024 } // limit file size to 5MB
        });
        this.app.use(upload.single('image'));
        this.app.use(bodyParser.raw({ limit: '50mb', inflate: true }))
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 500000 }));
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
            if (req.originalUrl.startsWith("/api/webhook")) {
                next();
            } else {
                express.json()(req, res, next);
            }
        });
        // Include request context middleware
        this.app.use(contextService.middleware("request"));

        this.app.use(async (req: Request, res: Response, next: NextFunction) => {
            contextService.set("request:url", req.url);
            next();
        });

        // startup express server to listen on a port
        this.app.listen(this.PORT, (): void => {
            console.log(`Server Running here 👉 http://localhost:${this.PORT}`);
        });

        // Start registering endpoints for api
        this.mainControllers.RegisterEndpoint(this.app);
    }
}
