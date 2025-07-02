import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: 'src/builder/main.ts',
    output: [
      {
        dir: 'dist/builder',
        format: 'esm',
        entryFileNames: '[name].mjs',
        sourcemap: true,
      },
      {
        dir: 'dist/builder',
        format: 'cjs',
        entryFileNames: '[name].cjs',
        sourcemap: true,
      },
    ],
    plugins: [typescript(), resolve(), terser()],
  },
  {
    input: 'src/fp/main.ts',
    output: [
      {
        dir: 'dist/fp',
        format: 'esm',
        entryFileNames: '[name].mjs',
        sourcemap: true,
      },
      {
        dir: 'dist/fp',
        format: 'cjs',
        entryFileNames: '[name].cjs',
        sourcemap: true,
      },
    ],
    plugins: [typescript(), resolve(), terser()],
  },
]
