import { Injex } from '@injex/vite';
import { EnvPlugin } from "@injex/env-plugin";
import { ButtonType, Shape } from './common/enums';

Injex.create({
    glob: () => import.meta.glob('./**/*.ts', { eager: true }),
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