# nano-i18n

`nano-i18n` is a tiny experimental internationalization library for JavaScript, using [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

## Introduction

> 🔎 **Internationalization** (often abbreviated as **i18n**) is making sure a program can be adapted for several languages / cultures. It involves translating the words, but also using date, time, and number formats to which the people from a certain culture are accustomed.

`nano-i18n` aims to offer a pleasant way of making your JavaScript app amenable to localization, without getting in the way too much. It focuses, for now, on translating strings.

## Installation

> 💡 You can [try out the API on RunKit](https://npm.runkit.com/nano-i18n) without installing the library.

### From the `npm` registry

Install the library using `npm` or `yarn`:

```bash
# using npm
npm install nano-i18n

# using yarn
yarn add nano-i18n
```

### As a `<script>` tag

You can load the library directly in the browser as a `<script>` tag, using **unpkg**. This will get you the latest version in the UMD module format:

```html
<script src='https://unpkg.com/nano-i18n'></script>
```

## Usage

Once you install the npm package, you can use it in your code like this:

```js
/*
	1. Import the methods you need
	------------------------------

	P.S. You can also use require('nano-i18n')
 */
import { load, k, v, t } from 'nano-i18n';

/*
	2. Load some translations into the store
	----------------------------------------
 */

// E.g. A simple key/value pair
load(k`Hello, ${'World'}!`, v`Salut, ${0}!`);

// In the translation, you can swap
// the order of the expressions
load(k`My name is ${'mine'}, yours is ${'yours'}`, v`Your name is ${1}, mine is ${0}`);

/* 
	3. Translate some messages
	--------------------------
*/

console.log(t`Hello, ${'Dan'}!`);
// => "Salut, Dan!"

console.log(t`My name is ${'Dan'}, yours is ${'Alex'}`);
// => "Your name is Alex, mine is Dan"
```

## API reference

### Managing translations

📖 **load**(key: _string_, value: _string_ | _function_)

The _load_ method adds translations to the store. You can add the translations one by one:

```js
import { load } from 'nano-i18n';

load(k`Hello, ${'World'}!`, v`Salut, ${0}!`);
```

Or a whole batch of translations:

```js
import { load } from 'nano-i18n';

let translations = {};
translations[k`Hello, ${'World'}!`] = v`Salut, ${0}!`;
translations[k`My name is ${'name'}`] = v`Numele meu este ${0}`;

load(translations);
```

Or using the [computed property names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) syntax:

```js
import { load } from 'nano-i18n';

load({
	[k`Hello, ${'World'}!`]: v`Salut, ${0}!`,
	[k`My name is ${'name'}`]: v`Numele meu este ${0}`
});
```

Or skipping the `k` literal tag altogether and using a string key directly:

```js
import { load } from 'nano-i18n';

load('Hello, {}!', v`Salut, ${0}!`);
```

You can also skip the `v` literal tag and send a simple string translation:

```js
import { load } from 'nano-i18n';

load('Hello, World!', 'Salut, lume!');
```

📖 **clear**()

The `clear` method removes all the translations from the store.

```js
import { clear } from 'nano-i18n';

clear();
```

📖 **config**(options: _object_)

Configures the library. Available options:

_log_: _number_ | _function_, default `0`

The log level for the library. Possible values:

-   `0` disables logging
-   `1` logs a warning in the console on a missing translation
-   `2` throws an error when encountering a missing translation

You can also set up a custom logging function, in case you want to keep track of exceptions some other way:

```js
import { config } from 'nano-i18n';

config({
	log: function(str) {
		// do something with `str`,
		// e.g. send the error to Sentry
	}
});
```

_placeholder_: _string_, default `{}`

The string to use as placeholder for interpolated values when generating the key for a translation.

### Literal tags

📖 **k**

Obtains the _key_ for a certain literal. By default, keys are obtained by replacing all interpolated values with the `{}` character sequence:

```js
import { k } from 'nano-i18n';

k`Hello, ${'World'}`;
// => "Hello, {}"
```

That means the strings you wish to translate must not otherwise contain the `{}` sequence. You may change the placeholder with the `config` method:

```js
import { config } from 'nano-i18n';

config({
	placeholder: '@@'
});
```

📖 **v**

Generates a translation function for a literal:

```js
import { v } from 'nano-i18n';

v`Salut, ${0}!`;
// => function(strings, values) {}
```

When providing a translation, the interpolated values need to be numbers (i.e. `${0}`, `${1}`, et cetera). They don't necessarily need to be in sequential order, so you can swap them around if the translation needs it.

📖 **t**

Get a translated string:

```js
import { t } from 'nano-i18n';

t`Hello, ${'Dan'}!`;
// => "Salut, Dan!"
```

If there's no translation available, it returns the normal interpolated string instead, and logs a warning to the console.

You can also use `t` as a normal function for translating dynamic strings:

```js
import { t } from 'nano-i18n';

t('Hello World');
```

This is useful for passing the `t` function to templating languages such as Mustache.

### Usage with Webpack

This library can be used with Webpack to load translations from external files with the `nano-i18n/loader` loader. `nano-i18n` comes with the loader, so you don't have to install any other packages.

**webpack.config.js**

```js
module.exports = {
	module: {
		rules: [
			{
				test: /\.json$/,
				include: /locales/,
				loader: 'nano-i18n/loader'
			}
		]
	}
};
```

By default, external files are expected to be JSONs containing an **array of `key`/`val` pairs**, i.e.:

**locales/ro-RO.json**

```js
[
	{ key: "Hello, ${'World'}", val: 'Salut, ${0}' },
	{ key: 'Some String', val: 'Un Șir Oarecare' }
	// etc.
];
```

With this setup in place, we can load the JSON as ready-to-use translations:

```js
import { load } from 'nano-i18n';
load(require('path/to/locales/ro-RO.json'));
```

`nano-i18n/loader` also accepts a `parse` option with you can use to keep the external translation files in any format, as long as you format it to `key`/`val` pairs.

Let's say you want to keep the translations in a CSV file so that it's easy to edit them in Microsoft Excel or macOS Numbers:

**locales/ro-RO.csv**

```csv
"key","val"
"Hello, ${'World'}","Salut, ${0}"
"Some String","Un Șir Oarecare"
```

In our Webpack configuration, we'll parse the CSV file using the [`d3-dsv`](https://github.com/d3/d3-dsv) package:

**webpack.config.js**

```js
let { csvParse } = require('d3-dsv');

module.exports = {
	module: {
		rules: [
			{
				test: /\.csv$/,
				include: /locales/,
				loader: 'nano-i18n/loader',
				options: {
					parse: text => csvParse(text)
				}
			}
		]
	}
};
```

> 💡 The `parse` option accepts a function which receives as its only argument the original text to parse, and which must return an array of `key`/`val` pairs.

## Further reading

-   [i18n with tagged template literals in ECMAScript 2015](https://jaysoo.ca/2014/03/20/i18n-with-es2015-template-literals/) by Jack Hsu
-   [Easy i18n in 10 lines of JavaScript (PoC)](https://codeburst.io/easy-i18n-in-10-lines-of-javascript-poc-eb9e5444d71e) by Andrea Giammarchi
-   [i18n Tagged Template Literals](http://i18n-tag.kolmer.net/) by Steffen Kolmer
