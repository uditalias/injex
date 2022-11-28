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
    define: {
        'process.env': {}
    },
    optimizeDeps: {
        include: ["@injex/core", "@injex/react-plugin", "@injex/graph-plugin"]
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