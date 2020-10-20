import { define, singleton } from "@injex/core";
import { IMiddleware } from "@injex/express-plugin";

let counter = 0;

@define()
@singleton()
export class RequestLogMiddleware implements IMiddleware {
    public handle(req, res, next) {
        console.log(`Incoming request #${++counter}`);
        next();
    }
}