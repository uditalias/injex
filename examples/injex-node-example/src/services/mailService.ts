import { define, injectAlias, singleton, AliasMap } from "@injex/core";
import { MailProvider } from "../common/enums";
import IMailProvider from "../interfaces/IMailProvider";
import { BaseService } from "./base/baseService";

@define()
@singleton()
export class MailService extends BaseService {
    @injectAlias("IMailProvider", "Type") private mailProviders: AliasMap<MailProvider, IMailProvider>;

    public send(message: string) {
        const mailProvider = this.mailProviders[this.env.mailProviderType];
        mailProvider.send(message);
    }
}