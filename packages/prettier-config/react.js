import baseConfig from "./index.js";

/** @type {import("prettier").Config} */
const config = {
    ...baseConfig,
    plugins: [...baseConfig.plugins, "prettier-plugin-tailwindcss"],
};

export default config;
