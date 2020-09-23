import { define, singleton, inject } from "@injex/core";

@define()
@singleton()
export class UnknownService {

    @inject() private atlantisLocation: any;

}