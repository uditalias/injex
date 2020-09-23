
import { define, singleton } from "@injex/core";
import { Mail } from "./mail";

@define()
@singleton()
export class MailService {

    public send(mail: Mail) {
        console.log("Sending message: " + mail.message);
    }
}