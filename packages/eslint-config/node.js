import { defineConfig } from "eslint/config";

import { base } from "./base.js";

/** @type {import("typescript-eslint").Config} */
export const node = defineConfig(...base);
