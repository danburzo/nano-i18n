/* 
	Webpack loader
*/
module.exports = function(text) {
	if (typeof this.cacheable === 'function') {
		this.cacheable();
	}

	let obj = text;
	if (typeof this.query === 'object' && typeof this.query.parse === 'function') {
		obj = this.query.parse(text);
	}

	return `var nano = require('nano-i18n');
var res = {};
${obj.map(entry => `res[nano.k\`${entry.key}\`] = nano.v\`${entry.val}\`;`).join('\n')}
module.exports = res;`;
};
