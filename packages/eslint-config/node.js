import { base } from "./base.js";
import { defineConfig } from "eslint/config";

/** @type {import("typescript-eslint").Config} */
export const node = defineConfig(...base);
