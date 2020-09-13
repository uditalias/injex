//@ts-nocheck
import { define } from "@injex/core";
import { controller } from "../../../src/decorators/controller";
import { get } from "../../../src/decorators/get";
import { middleware } from "../../../src/decorators/middleware";
import { AuthMiddleware } from "./AuthMiddleware";

@define()
@controller()
export class HomeController {

    @get("/")
    public render(req, res) {
        res.send("<h1>Welcome home!</h1>");
    }

    @get("/cat/:category")
    public renderCategory(req, res) {
        res.send(`<h1>Welcome to ${req.params.category} category</h1>`);
    }

    @get("/cart")
    @middleware(AuthMiddleware)
    public privateHandler(req, res) {
        res.status(401);
        res.send("<h1>This is your cart</h1>");
    }
}