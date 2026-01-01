import { Request, Response, Application } from "express";
import { Service } from "typedi";
import { ENVIRONMENT } from "../environment";
import { OK } from "../helpers/ActionResults";
import IController from "../interfaces/IController";
const contextService = require("request-context");

/*
  Example controller that will listen at the root API domain
  TODO: Replace with a status indicator
*/
@Service()
export default class RootController implements IController {
	RegisterEndpoint(app: Application): void {
		app.get(`${ENVIRONMENT.API_ROUTE}/`, async (req: Request, res: Response): Promise<void> => {
			res.send("Node.js server running w/ Typescript");
		});
		app.get(`${ENVIRONMENT.API_ROUTE}/__`, async (req: Request, res: Response) => this.endpoint(req, res));
	}

	private async endpoint(req: Request, res: Response): Promise<void> {
		var body: any = req.body as {};
		return OK(res, {});
	}
}
