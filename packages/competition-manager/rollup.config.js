import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
export default [{
  input: './src/manager.js',
  output: [{
    dir: 'dist',
    format: 'cjs'
  }],
  plugins: [
    json()
  ]
}]
