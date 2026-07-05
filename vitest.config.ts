import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        setupFiles: ['./setupTests.ts'],
        fileParallelism: false,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            exclude: [
                 ...coverageConfigDefaults.exclude,
                'src/domain/repositories/**', 
                'src/domain/datasource/**', 
                'src/generated/**', 
                'src/domain/index.ts', 
                'src/domain/dtos/index.ts'
            ]
        },
    },
});