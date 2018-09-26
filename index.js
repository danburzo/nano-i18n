/*
	The translation store.
	Add things to it with load(),
	and empty it with clear().
 */
let db = {};

const PLACEHOLDER = '{}';

let _placeholder = PLACEHOLDER;

// ignores missing translation
const LOG_SILENT = 0;

// logs warning in console on missing translation
const LOG_WARN = 1;

// throws error on missing translation
const LOG_ERROR = 2;

/*
	Log level. Configurable from config()
 */
let _log = LOG_SILENT;

/*
	Combines two arrays of strings of (mostly) the same length
	into a single string, through interpolation.
 */
function interpolate(strings, values) {
	return strings.reduce(function(result, current_str, idx) {
		return result + current_str + (idx < values.length ? values[idx] : '');
	}, '');
}

/*
	Generate a key for a certain literal.
	Interpolated values from the template literal are ignored,
	and replaced with the `{}` placeholder.

	E.g. key`Hello, ${'World'}` => "Hello, {}"
 */
function key(strings) {
	return strings.join(_placeholder);
}

/*
	Provide a translation for a string.
	Used in conjunction with `key` and `load`.
 */
function value(strings, ...placeholders) {
	return values =>
		placeholders.length
			? interpolate(strings, placeholders.map(i => values[i]))
			: strings.join('');
}

/*
	Translate a string. E.g.

		t`Hello, ${'World'}!` => "Salut, World!"

	If no translation can be found, 
	a simple interpolation is returned instead.
 */
function translate(strings, ...values) {
	let isString = typeof strings === 'string';
	let k = isString ? strings : key(strings);
	let val = db[k];
	if (!val) {
		exceptional(`No translation found for ${k}`);
		return isString ? strings : interpolate(strings, values);
	}
	return typeof val === 'string' ? val : val(values);
}

/*
	Load translations into the store.

	You can either load them in bulk by sending
	an object as the first argument, or one by one:

		load(k`Hello, ${'World'}`, v`Salut, ${0}`);

	You can also use static strings as translations:

		load('Hello, World!', 'Salut, lume!');
 */
function load(k, v) {
	if (typeof k === 'object') {
		Object.keys(k).forEach(i => {
			db[i] = k[i];
		});
	}
	db[k] = v;
}

/*
	Empty the translations store.
 */
function clear() {
	db = {};
}

function exceptional(str) {
	if (_log === LOG_WARN) {
		console.warn(str);
	} else if (_log === LOG_ERROR) {
		throw new Error(str);
	}
}

function config(opts) {
	if (opts.log !== undefined) {
		_log = opts.log;
	}

	if (opts.placeholder !== undefined) {
		_placeholder = opts.placeholder;
	}
}

/* 
	Webpack loader
*/
function loader(obj) {
	if (typeof this.cacheable === 'function') {
		this.cacheable();
	}

	return `var nano = require('nano-i18n');
var res = {};
${obj.map(entry => `res[nano.k\`${entry.key}\`] = nano.v\`${entry.val}\`;`).join('\n')}
module.exports = res;`;
}

export { translate as t, value as v, key as k, load, clear, config, loader };
