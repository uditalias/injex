import { Injex } from "../lib";

(async function () {
	await Injex
		.create()
		.bootstrap();
})();