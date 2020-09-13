import { define, singleton } from "@injex/core";
import { controller, get } from "@injex/express-plugin";
import { Request, Response } from "express";

@define()
@singleton()
@controller()
export class HomeController {

    @get("/")
    public renderHome(req: Request, res: Response) {
        res.send(`
            <h1>Welcome!</h1>
            <a href="/chat">Chat</a>
            <a href="/terms-and-conditions">Terms</a>
        `);
    }

    @get("/terms-and-conditions")
    public renderTerms(req: Request, res: Response) {
        res.send(`
            <a href="/">< Back Home</a>
            <h1>Terms and Conditions!</h1>
        `);
    }
}