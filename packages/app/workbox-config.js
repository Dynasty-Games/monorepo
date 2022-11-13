module.exports = {
	globDirectory: 'www/',
	globPatterns: [
		'**/*.{js,png,svg,ico,html,json,txt}'
	],
	swDest: 'www/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};