/* 
	Webpack loader
*/
const out = obj => `var nano = require('nano-i18n'); 
var res = {};
${obj.map(entry => `res[nano.k\`${entry.key}\`] = nano.v\`${entry.val}\`;`).join('\n')}
module.exports = res;`;

module.exports = function (text) {
	if (typeof this.cacheable === 'function') {
		this.cacheable();
	}
	let p =
		typeof this.query === 'object' && typeof this.query.parse === 'function'
			? this.query.parse(text)
			: text;
	if (typeof this.async === 'function') {
		let cb = this.async();
		Promise.resolve(p).then(obj => {
			cb(null, out(obj));
		});
	} else {
		return out(p);
	}
};
