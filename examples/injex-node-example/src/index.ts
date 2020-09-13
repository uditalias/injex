import { Injex } from "@injex/node";
import { EnvPlugin } from "@injex/env-plugin";
import { MailProvider } from "./common/enums";

Injex.create({
    rootDirs: [__dirname],
    plugins: [
        new EnvPlugin({
            defaults: {
                mailProviderType: MailProvider.MICROSOFT
            }
        })
    ]
}).bootstrap();