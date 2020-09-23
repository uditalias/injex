import { alias, define, singleton } from "@injex/core";
import { MailProvider } from "../common/enums";
import IMailProvider from "../interfaces/IMailProvider";

@define()
@singleton()
@alias("IMailProvider")
export class GoogleMailProvider implements IMailProvider {

    public readonly Type = MailProvider.GOOGLE;

    public async send(message: string): Promise<void> {
        console.log("* GMAIL: sending mail message...");
        console.log(`* GMAIL: ${message}`);
        console.log("* GMAIL: Message sent successfully.");
    }
}