import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        setupFiles: ['./setupTests.ts'],
        fileParallelism: false,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
        },
    },
});