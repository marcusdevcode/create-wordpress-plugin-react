import { registerBlockType } from '@wordpress/blocks';

// 1. Explicitly grab only the index TS/TSX files
const scriptContext = require.context('./blocks', true, /\/index\.(ts|tsx)$/);

// 2. Explicitly grab only the block.json files
const jsonContext = require.context('./blocks', true, /\/block\.json$/);

// Map our JSON metadata files by their directory name for easy lookups
const metadataRegistry: Record<string, any> = {};

jsonContext.keys().forEach((jsonPath) => {
    // Extract folder name (e.g., './hero/block.json' -> 'hero')
    const folderName = jsonPath.split('/')[1];
    metadataRegistry[folderName] = jsonContext(jsonPath);
});

// Loop through the TypeScript modules and pair them up with their metadata
scriptContext.keys().forEach((scriptPath) => {
    const blockModule = scriptContext(scriptPath);
    const initFunction = blockModule.default;
    
    // Extract folder name (e.g., './hero/index.tsx' -> 'hero')
    const folderName = scriptPath.split('/')[1];
    const metadata = metadataRegistry[folderName];

    if (metadata?.name && typeof initFunction === 'function') {
        registerBlockType(metadata.name, {
            ...metadata,
            ...initFunction(),
        });
    }
});