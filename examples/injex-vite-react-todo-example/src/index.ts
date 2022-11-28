import { GraphPlugin } from '@injex/graph-plugin';
import { Injex } from '@injex/vite';
import { configure } from 'mobx';

configure({
    enforceActions: 'never'
});

const container = Injex.create({
    // This line fails on Netlify's build
    // error TS2339: Property 'glob' does not exist on type 'ImportMeta'.
    // Adding @ts-ignore flag for now to make it work.
    // @ts-ignore
    glob: () => import.meta.glob('./**/*.{ts,tsx}', { eager: true }),

    plugins: [
        new GraphPlugin({
            appName: 'injex-react-todo'
        })
    ]
});

container.addObject({}, "myObject");

container.bootstrap();