import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const bundle = (config) => ({
  ...config,
  input: "src/AesCmac.ts",
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild()],
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
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `lib/aes-cmac.d.ts`,
      format: "es",
    },
  }),
];
