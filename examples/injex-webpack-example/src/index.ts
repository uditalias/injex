import { Injex } from "@injex/webpack";
import { EnvPlugin } from "@injex/env-plugin";
import { ButtonType, Shape } from 'common/enums';

Injex.create({
    resolveContext: () => {
        return require.context(__dirname, true, /[^.mdl]\.ts$/)
    },
    asyncModuleRequire: true,
    plugins: [
        new EnvPlugin({
            environments: {
                development: {
                    buttonType: ButtonType.Big,
                    shape: Shape.Circle,
                },
                production: {
                    buttonType: ButtonType.Small,
                    shape: Shape.Rectangle,
                }
            }
        })
    ]
}).bootstrap();

if (module.hot) {
    module.hot.accept();
}