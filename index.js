/*
	The translation store.
	Add things to it with load(),
	and empty it with clear().
 */
let db = {};

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
	return strings.join('{}');
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
	let k = key(strings);
	if (!db[k]) {
		console.warn(`No translation found for ${k}`);
		return interpolate(strings, values);
	}
	return db[k](values);
}

/*
	Load translations into the store.

	You can either load them in bulk by sending
	an object as the first argument, or one by one:

		load(k`Hello, ${'World'}`, v`Salut, ${0}`);
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

export { translate as t, value as v, key as k, load, clear };
