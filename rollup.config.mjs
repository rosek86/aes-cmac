import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

export default [
  // Node builds (CJS + ESM)
  {
    plugins: [esbuild()],
    input: "src/AesCmac.ts",
    external: (id) => !/^[./]/.test(id),
    output: [
      {
        file: `lib/aes-cmac.cjs`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `lib/aes-cmac.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
  },
  // Browser build (IIFE, bundled)
  {
    input: "src/AesCmac.ts",
    plugins: [esbuild({ target: "es2017", minify: true })],
    output: {
      file: `lib/aes-cmac.browser.js`,
      format: "iife",
      name: "AesCmac", // Global variable for browser
      sourcemap: true,
    },
  },
  // Type definitions
  {
    plugins: [dts()],
    input: "src/AesCmac.ts",
    external: (id) => !/^[./]/.test(id),
    output: [
      {
        file: `lib/aes-cmac.d.mts`,
        format: "es",
      },
      {
        file: `lib/aes-cmac.d.cts`,
        format: "cjs",
      },
    ],
  },
];
