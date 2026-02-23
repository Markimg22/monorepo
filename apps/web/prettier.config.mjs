import rootConfig from '../../prettier.config.mjs';

/** @type {import("prettier").Config} */
export default {
    ...rootConfig,
    tailwindStylesheet: './src/styles/globals.css'
};
