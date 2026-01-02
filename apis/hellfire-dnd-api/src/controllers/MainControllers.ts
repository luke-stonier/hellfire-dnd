import { Application } from "express";
import { Service } from "typedi";
import RootController from "./RootController";
import IController from "../interfaces/IController";

/*
  This controller will register all of the child controllers, 
  taking the logic away from the index.ts file to keep it clean.
*/
@Service()
export default class MainControllers implements IController {
	// Once controller has been created inheriting the IController interface
	// and the @Service() decorator, you can use DI to use the controller here
	// and register it in the app.
	constructor(
		private rootController: RootController,
	) { }

	/* Call from index to register endpoints from other controllers */
	public RegisterEndpoint(app: Application): void {
		// Add controllers here to register with the application
		this.rootController.RegisterEndpoint(app);

		console.log("Registered Controllers ✅ ");
	}
}
