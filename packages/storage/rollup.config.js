import resolve from '@rollup/plugin-node-resolve'

export default [{
  input: ['src/storage.js', 'src/storage-server.js'],
  output: [{
    format: 'cjs',
    dir: './'
  }]
}, {
  input: ['src/storage-client.js'],
  output: [{
    format: 'cjs',
    dir: './'
  }],
  plugins: [
    resolve()
  ]
}]
