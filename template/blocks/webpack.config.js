import defaultConfig from '@wordpress/scripts/config/webpack.config.js';
import path from 'path';
import DependencyExtractionWebpackPlugin from '@wordpress/dependency-extraction-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin'; // <-- 1. Import the plugin

const dev_folder = 'src';
const build_folder = 'frontend';
const BLOCKS_SLUG = 'blocksslug';

// Filter out the default instance so we don't duplicate it
const filteredPlugins = defaultConfig.plugins.filter(
    (plugin) => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
);
const isDev = process.env.NODE_ENV === 'development';
export default {
    ...defaultConfig,
    devtool: isDev ? 'eval-source-map' : false,
    entry: {
        [`${BLOCKS_SLUG}`]: path.resolve(process.cwd(), dev_folder, 'index.ts'),
        [`${BLOCKS_SLUG}-style`]: path.resolve(process.cwd(), dev_folder, 'index.scss'),
        [`${BLOCKS_SLUG}-editor`]: path.resolve(process.cwd(), dev_folder, 'editor.scss'),
    },
    output: {
        ...defaultConfig.output,
        path: path.resolve(process.cwd(), build_folder), 
        filename: '[name].js',
    },
    
    plugins: [
        ...filteredPlugins,
        new DependencyExtractionWebpackPlugin({ 
            outputFormat: 'json',
        }),
        // 2. Add the CopyWebpackPlugin configuration
        new CopyWebpackPlugin({
            patterns: [
                {
                    // Looks inside your dev_folder (src) for any nested folder containing .php files
                    from: `${dev_folder}/**/*.php`,
                    to({ context, absoluteFilename }) {
                        // 1. Get the path relative to 'src' (e.g., 'blocks/my-block/render.php')
                        let relativePath = path.relative(path.resolve(process.cwd(), dev_folder), absoluteFilename);
                        
                        // 2. FIX: Strip out the leading 'blocks/' if your src folder uses that subfolder
                        relativePath = relativePath.replace(/^blocks[\/\\]/, '');

                        // 3. Outputs perfectly to: backend/blocks/[blockname]/[filename].php
                        return path.resolve(process.cwd(), 'backend/blocks', relativePath);
                    },
                    // Ensures Webpack watches these PHP files for changes during `npm run start`
                    toType: 'template',
                },
            ],
        }),
    ],

    module: {
        ...defaultConfig.module,
        rules: [
            ...defaultConfig.module.rules,
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },

    cache: {
        type: 'filesystem', 
        version: '1.0.0',   
        buildDependencies: {
            config: [path.resolve(process.cwd(), 'webpack.config.js')], 
        },
    },
    
    optimization: {
        ...defaultConfig.optimization,
        minimize: true,
        minimizer: [
            ...(defaultConfig.optimization?.minimizer?.map((minimizer) => {
                if (minimizer.constructor.name === 'CssMinimizerPlugin') {
                    if (minimizer.options && minimizer.options.minimizer) {
                        minimizer.options.minimizer.options = {
                            ...minimizer.options.minimizer.options,
                            sourceMap: false,
                        };
                    }
                }
                return minimizer;
            }) || []),
        ],
    },
};