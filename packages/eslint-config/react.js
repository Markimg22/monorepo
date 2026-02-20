import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import next from "@next/eslint-plugin-next";

import { base } from "./base.js";

/** @type {import("typescript-eslint").Config} */
export const react = defineConfig(...base, {
    plugins: {
        "react-hooks": reactHooks,
        "@next/next": next,
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        ...next.configs.recommended.rules,
        ...next.configs["core-web-vitals"].rules,
    },
});
