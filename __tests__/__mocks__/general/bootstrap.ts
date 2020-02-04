import { bootstrap } from "../../../src";
import { IBootstrap } from "../../../src/interfaces";

@bootstrap()
export class MyBootstrapModule implements IBootstrap {

	public didRun: boolean;

	constructor() {
		this.didRun = false;
	}

	public run() {
		this.didRun = true;
	}
}