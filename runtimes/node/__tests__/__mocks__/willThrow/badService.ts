import { define, singleton, init } from "@injex/core";

@define()
@singleton()
export class BadService {

	@init()
	public async initialize() {
		await new Promise((_, reject) => setTimeout(() => reject()));
	}
}