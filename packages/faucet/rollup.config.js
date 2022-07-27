import json from  '@rollup/plugin-json'
import { execSync } from 'child_process'
import html from '@web/rollup-plugin-html';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import summary from 'rollup-plugin-summary';

execSync('rm -rf www/*.js')


export default [
	{
		input: ['src/views/home.js'],
		output: {
			dir: 'www',
			format: 'es',
			sourcemap: false
		},
		plugins: [
			html({
				input: ['src/index.html'],
				absoluteBaseUrl: 'https://dynastyfaucet.web.app'
			}),
			json(),
			resolve(),
			minifyHTML(),
			summary(),
    	// Minify JS
	    terser({
	      ecma: 2020,
	      module: true,
	      warnings: true,
	    }),
		],
		external: [
			'./api.js',
			'./third-party/ethers.js',
			'./third-party/WalletConnectClient.js'
		]
	}, {
		input: ['src/themes/default.js', 'src/themes/dark.js'],
		output: {
			dir: 'www/themes',
			format: 'es'
		}
	}
];
