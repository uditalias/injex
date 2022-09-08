import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react({
        babel: {
            plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-proposal-class-properties", { loose: true }]
            ]
        }
    })],
    optimizeDeps: {
        include: ["@injex/core", "@injex/react-plugin"]
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