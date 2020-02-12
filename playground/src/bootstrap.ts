import { bootstrap } from "../../lib";
import { IBootstrap } from "../../typings"

@bootstrap()
export class Bootstrap implements IBootstrap {
	public run() {
		console.log("Bootstrap is up!");
	}
}