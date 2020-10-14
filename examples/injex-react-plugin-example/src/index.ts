import { Injex } from "@injex/webpack";
import { ReactPlugin } from "@injex/react-plugin";
import { EnvPlugin } from "@injex/env-plugin";

Injex.create({
    resolveContext: () => require.context(__dirname, true, /\.tsx?$/),
    plugins: [
        new ReactPlugin({
            rootElementOrSelector: "#root"
        }),
        new EnvPlugin({
            defaults: {
                apiKey: "AIzaSyBtuX8fK7Mhphan_BNlMOzblAFGBfpmrHc",
                messagingSenderId: "865803537395",
                appId: "1:865803537395:web:df395a99ec9c198f64a086"
            }
        })
    ]
}).bootstrap();

if (module.hot) {
    module.hot.accept();
}