/** @type {import("prettier").Config} */
const config = {
    singleQuote: true,
    semi: true,
    tabWidth: 4,
    printWidth: 130,
    trailingComma: 'none',
    endOfLine: 'auto',
    bracketSpacing: true,
    plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
    tailwindFunctions: ['cva', 'cn', 'clsx', 'twMerge']
};

export default config;
