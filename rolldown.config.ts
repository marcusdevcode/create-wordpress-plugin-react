import { defineConfig } from 'rolldown';

export default defineConfig({
    input: 'main.ts',
    platform: 'node',
    output: {
        file: 'bundle.js',
        format: 'esm',
    }
});
