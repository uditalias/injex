import { Injex } from '@injex/vite';
import { configure } from 'mobx';

configure({
    enforceActions: 'never'
});

Injex.create({
    glob: () => import.meta.glob('./**/*.{ts,tsx}', { eager: true })
}).bootstrap();