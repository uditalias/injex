//@ts-nocheck
import { define, singleton } from "@injex/core";
import { IMiddleware } from "../../../src/interfaces";

@define()
@singleton()
export class AuthMiddleware implements IMiddleware {
    public handle(req, res, next) {
        const token = req.query.token;
        if (token === "123456") {
            next();
        } else {
            res.send("unauthorize");
            next(new Error("unauthorize"));
        }
    }
}