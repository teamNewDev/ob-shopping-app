module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{js,css,html,md,jpg,svg,zip,png}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'sw.js'
};