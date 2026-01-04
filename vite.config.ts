import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                action: resolve(__dirname, 'action.html'),
                background: resolve(__dirname, 'background.html'),
                assignCharacter: resolve(__dirname, 'assignCharacter.html'),
                'rules-ref': resolve(__dirname, 'rules-ref.html'),
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        cors: {
            origin: 'https://www.owlbear.rodeo',
        },
    },
});
