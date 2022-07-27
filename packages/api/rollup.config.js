import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

export default [{
  input: 'lib/api.js',
  output: [{
    dir: './',
    format: 'cjs'
  }],
  plugins: [
    json()
  ]
}]
