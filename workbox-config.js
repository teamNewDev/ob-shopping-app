module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{jpg,svg,zip,png,js,css,html,json,md}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'sw.js'
};