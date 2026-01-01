import { Application } from "express";

/*
  All controllers to use this interface, allows the main controller class
  to pass the application through to the controllers to register endpoints
*/
export default interface IController {
	RegisterEndpoint(app: Application): void;
}
