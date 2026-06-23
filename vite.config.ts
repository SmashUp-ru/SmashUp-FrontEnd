import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                // React-ядро держим в ОДНОМ чанке (react/react-dom/router): дробление
                // React-зависимых вендоров ломало порядок инициализации в проде
                // (React.useLayoutEffect undefined → белый экран). Дополнительно
                // выносим тяжёлые независимые либы в свои кэшируемые чанки.
                manualChunks: {
                    'react-vendor': [
                        'react',
                        'react-dom',
                        'react-router-dom',
                        'react-router',
                        '@remix-run/router'
                    ],
                    forms: ['react-hook-form', 'zod'],
                    player: ['howler', 'react-howler'],
                    // Чистые утилиты без React — безопасно выносить отдельно.
                    utils: ['tailwind-merge', 'clsx', 'axios'],
                    markdown: ['react-markdown']
                }
            }
        }
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts']
    }
});
