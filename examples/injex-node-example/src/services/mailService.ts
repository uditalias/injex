import { define, inject, injectAlias, singleton } from "@injex/core";
import { AliasMap } from "@injex/core/src";
import { MailProvider } from "../common/enums";
import IEnvironment from "../interfaces/IEnvironment";
import IMailProvider from "../interfaces/IMailProvider";

@define()
@singleton()
export class MailService {
    @inject() private env: IEnvironment;
    @injectAlias("IMailProvider", "Type") private mailProviders: AliasMap<MailProvider, IMailProvider>;

    public send(message: string) {
        const mailProvider = this.mailProviders[this.env.mailProviderType];
        mailProvider.send(message);
    }
}