import { Injex } from "@injex/node";
import { EnvPlugin } from "@injex/env-plugin";
import { MailProvider } from "./common/enums";
import IEnvironment from "./interfaces/IEnvironment";

Injex.create({
    rootDirs: [__dirname],
    plugins: [
        new EnvPlugin<IEnvironment>({
            defaults: {
                mailProviderType: MailProvider.MICROSOFT
            }
        })
    ]
}).bootstrap();