import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { execSync } from 'child_process'
import cleaner from 'rollup-plugin-cleaner';
import path from 'path'

try {
  execSync('rm -rf www/themes/*.js')
  execSync('rm -rf www/*.js')
  execSync('rm -rf www/*.txt')

} catch (e) {

}


export default [{
  input: ['src/shell.js', 'src/views/home.js', 'src/views/news.js', 'src/views/competitions.js', 'src/views/competition.js', 'src/views/contests.js', 'src/views/history.js', 'src/views/connect.js', 'src/views/rankings.js', 'src/views/member-rankings.js', 'src/views/live.js'],
  output: {
    dir: 'www',
    format: 'es',
  },
  external: ['wallet-connect.js', 'src/wallet-connect.js', '@walletconnect/client', '@walletconnect', './wallet-connect.js', './../walletconnect/walletconnect.js'],
  plugins: [
    cleaner({
      targets: [
        './www/**/*.js'
      ]
    }),
    json(),
    nodeResolve({
      browser: true
    })
  ]
}, {
  input: ['src/themes/dark.js', 'src/themes/default.js'],
  output: {
    dir: 'www/themes',
    format: 'es',
  },
  plugins: [    
    cleaner({
      targets: [
        './www/**/*.js'
      ]
    }),
    json(),
    nodeResolve({
      browser: true
    })
  ]
}]
