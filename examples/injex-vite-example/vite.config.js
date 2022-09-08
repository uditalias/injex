import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps: {
        include: ["@injex/core", "@injex/env-plugin"]
    },
    esbuild: {
        keepNames: true
    },
    build: {
        commonjsOptions: {
            include: [/injex/]
        }
    }
});