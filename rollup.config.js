// @ts-check
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from "@rollup/plugin-typescript"

const folders = {
  esm: "./lib/esm",
  cjs: "./lib/cjs",
}

/** @type {(format: 'cjs' | 'esm') => import('rollup').RollupOptions} */
const config = (format) => ({
  input: {
    main: "src/main.ts",
  },
  output: [
    { dir: folders[format], name: 'main.js', format, sourcemap: false },
  ],
  plugins: [
    resolve(),
    typescript({
      project: "./tsconfig.json",
      declaration: true,
      declarationDir: folders[format],
      sourceMap: false,
    }),
    terser({ sourceMap: false }),
  ],
})
export default [
  config('cjs'),
  config('esm'),
]
