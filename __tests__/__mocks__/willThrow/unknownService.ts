import { define, singleton, inject } from "../../../src";

@define()
@singleton()
export class UnknownService {

	@inject() private atlantisLocation: any;

}