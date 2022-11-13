import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { execSync } from 'child_process'
import {readFileSync, writeFileSync} from 'fs'
import cleaner from 'rollup-plugin-cleaner';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
try {
  execSync('rm -rf www/themes/*.js')
  execSync('rm -rf www/*.js')
  execSync('rm -rf www/*.txt')

} catch (e) {

}


const build = String(new Date().getTime())
let lastbuild
try {
  lastbuild = readFileSync('.lastbuild')
  lastbuild = lastbuild.toString()
} catch (e) {
  lastbuild = build
}

writeFileSync('lastbuild', build)

export default [{
  input: ['src/shell.js', 'src/views/home.js', 'src/views/news.js', 'src/views/competitions.js', 'src/views/competition-list.js', 'src/views/styles.js', 'src/views/competition.js', 'src/views/contests.js', 'src/views/history.js', 'src/views/games.js', 'src/views/connect.js', 'src/views/rankings.js', 'src/views/member-rankings.js', 'src/views/live.js'],
  output: {
    dir: 'www',
    format: 'es',
  },
  external: ['node-fetch', 'wallet-connect.js', 'src/wallet-connect.js', '@walletconnect/client', '@walletconnect', './wallet-connect.js', './../walletconnect/walletconnect.js'],
  plugins: [
    cleaner({
      targets: [
        './www/**/*.js'
      ]
    }),
    replace({
      "import _fetch from 'node-fetch'": ''
    }),
    json(),
    nodeResolve({
      browser: true
    }),
    terser()
  ]
}, {
  input: ['src/themes/dark.js', 'src/themes/default.js'],
  output: {
    dir: 'www/themes',
    format: 'es',
  },
  plugins: [
    json(),
    nodeResolve({
      browser: true
    })
  ]
}]
