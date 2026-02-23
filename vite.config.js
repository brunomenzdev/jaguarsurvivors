import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: 'bundle.js',
                chunkFileNames: 'bundle.js',
                assetFileNames: 'assets/[name][extname]'
            }
        }
    }
});
