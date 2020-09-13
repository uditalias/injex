import { Injex } from "@injex/node";
import { EnvPlugin } from "@injex/env-plugin";
import { ExpressPlugin } from "@injex/express-plugin";
import * as bodyParser from "body-parser";

Injex.create({
    rootDirs: [__dirname],
    plugins: [
        new ExpressPlugin({
            createAppCallback: (app) => {
                app.use(bodyParser.urlencoded({ extended: false }));
            }
        }),
        new EnvPlugin({
            defaults: {
                port: 3001
            }
        })
    ]
}).bootstrap();