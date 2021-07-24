import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: './src/index.js',
  output: {
    file: './bundle/scrollbar.js',
    format: 'umd',
    name: 'scrollbar',
    sourcemap: true
  },

  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    babel({
      exclude: 'node_modules/**'
    })
  ],

  external: ['vue']
}
