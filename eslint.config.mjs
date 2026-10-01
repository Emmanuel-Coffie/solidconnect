import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      ".next-dev/**",
      "node_modules/**",
      "playwright-report/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["scripts/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  { rules: { "@next/next/no-img-element": "off" } },
];
export default config;
