import { define, singleton, init } from "../../../src";

@define()
@singleton()
export class BadService {

	@init()
	public initialize() {
		throw new Error()
	}
}