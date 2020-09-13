import { define, inject, singleton } from "@injex/core";
import { controller, get, post } from "@injex/express-plugin";
import { ChatManager } from "../managers/chatManager";

@define()
@singleton()
@controller()
export class ChatController {

    @inject() private chatManager: ChatManager;

    @get("/chat")
    public chat(req, res) {
        const messages = this.chatManager.getAllMessages();

        res.send(`
            <a href="/">< Back Home</a>
            <h1>Simple chat</h1>
            <ul>
                ${messages.map((message) => `
                    <li><span style="color: #aaa">${new Date(message.date).toLocaleTimeString()}:</span> ${message.text}</li>
                `).join("")}
            </ul>
            <form method="post" action="/chat/message">
                <input type="text" autocomplete="off" autofocus="true" name="message" /> <button>Send</button>
            </form>
        `);
    }

    @post("/chat/message")
    public chatMessage(req, res) {
        this.chatManager.addMessage(req.body.message);
        res.redirect("/chat");
    }
}