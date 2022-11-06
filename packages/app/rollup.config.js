import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { execSync } from 'child_process'
import cleaner from 'rollup-plugin-cleaner';
import replace from '@rollup/plugin-replace';
import { readFile } from 'fs/promises';
import { join } from 'path';
try {
  execSync('rm -rf www/themes/*.js')
  execSync('rm -rf www/*.js')
  execSync('rm -rf www/*.txt')

} catch (e) {

}

function resolveEsm() {
  return {
    name: 'resolve-esm', // this name will show up in warnings and errors
    resolveId ( source ) {
      if (source.startsWith('@walletconnect')) {
        return source; // this signals that rollup should not ask other plugins or check the file system to find this id
      }
      return null; // other ids should be handled as usually
    },
    async load ( id ) {
      if (id.startsWith('@walletconnect')) {
        let target = 'dist/esm/index.js'
        if (id === '@walletconnect/qrcode-modal') target = 'dist/umd/index.min.js'
        if (id === '@walletconnect/crypto') target = 'dist/esm/browser/index.js'

        return (await readFile(join('node_modules', id, target))).toString()
      }
      return null; // other ids should be handled as usually
    }
  }
}

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
    })
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
