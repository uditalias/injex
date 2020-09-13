import { alias, define, singleton } from "@injex/core";
import { MailProvider } from "../common/enums";
import IMailProvider from "../interfaces/IMailProvider";

@define()
@singleton()
@alias("IMailProvider")
export class MicrosoftMailProvider implements IMailProvider {

    public readonly Type = MailProvider.MICROSOFT;

    public async send(message: string): Promise<void> {
        console.log("* MSN: sending mail message...");
        console.log(`* MSN: ${message}`);
        console.log("* MSN: Message sent successfully.");
    }
}