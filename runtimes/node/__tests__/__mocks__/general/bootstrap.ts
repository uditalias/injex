import { IBootstrap, bootstrap } from "@injex/core";

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