import { Injex } from "@injex/webpack";
import { EnvPlugin } from "@injex/env-plugin";
import { ButtonType } from 'common/enums';

Injex.create({
    resolveContext: () => {
        return require.context(__dirname, true, /\.ts$/)
    },
    plugins: [
        new EnvPlugin({
            environments: {
                development: {
                    buttonType: ButtonType.Big
                },
                production: {
                    buttonType: ButtonType.Small
                }
            }
        })
    ]
}).bootstrap();

if (module.hot) {
    module.hot.accept();
}