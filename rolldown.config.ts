import { defineConfig } from 'rolldown';

export default defineConfig({
    input: 'main.cjs',
    output: {
        file: 'bundle.cjs',
        format: 'esm',
    }
});
