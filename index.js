const db = {};

/*
	Combines two arrays of strings of (mostly) the same length
	into a single string, through interpolation.
 */
function interpolate(strings, values) {
	return strings.reduce(function(result, current_str, idx) {
		return result + current_str + (idx < values.length ? values[idx] : '');
	}, '');
}

function key(strings) {
	return strings.join('{}');
}

function value(strings, ...placeholders) {
	return values => interpolate(strings, placeholders.map(i => values[i]));
}

function translate(strings, ...values) {
	let k = key(strings);
	if (!db[k]) {
		console.warn(`No translation found for ${k}`);
		return interpolate(strings, values);
	}
	return db[k](values);
}

function load(k, v) {
	if (typeof k === 'object') {
		Object.keys(k).forEach(i => {
			db[i] = k[i];
		});
	}
	db[k] = v;
}

export { translate as t, value as v, key as k, load };
