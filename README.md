# nano-i18n

Tiny experimental i18n library for JavaScript using [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

I'm starting small and evolving as the need arises.

## Installation

### Try it out

You can [try out the API on RunKit](https://npm.runkit.com/nano-i18n) without installing the library.

### As a Node.js module

Install the library using `npm` or `yarn`:

```bash
npm install nano-i18n
```

```bash
yarn add nano-i18n
```

### Using unpkg

You can load the library through a `<script>` tag using `unpkg.com`:

```html
<script src='https://unpkg.com/nano-i18n'></script>
```

## Usage

```js
import { load, k, v, t } from 'nano-i18n';

// 1. Load some translations

// Simple replacement
load(k`Hello, ${'World'}!`, v`Salut, ${0}!`);

// Swap the order of values in the translation
load(k`My name is ${'mine'}, yours is ${'yours'}`, v`Your name is ${1}, mine is ${0}`);

// 2. Translate some messages
console.log(t`Hello, ${'Dan'}!`);
// => "Salut, Dan!"

console.log(t`My name is ${'Dan'}, yours is ${'Alex'}`);
// => "Your name is Alex, mine is Dan"
```

## API reference

### Managing translations

§ **load**(key: _string_, value: _function_)

Set up a translation:

```js
import { load } from 'nano-i18n';

load(k`Hello, ${'World'}!`, v`Salut, ${0}!`);
```

You can also add a batch of translations:

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

Or skipping the `k` literal altogether and using a string key directly:

```js
import { load } from 'nano-i18n';

load('Hello, {}!', v`Salut, ${0}!`);
```

§ **clear**()

Clears all the translations:

```js
import { clear } from 'nano-i18n';

clear();
```

### Literal tags

§ **k**

Obtains the _key_ for a certain literal:

```js
import { k } from 'nano-i18n';

k`Hello, ${'World'}`;
// => "Hello, {}"
```

Keys are generated by replacing all values with the `{}` sequence.

**Note:** That means that currently, the strings you wish to translate may not contain the `{}` sequence.

§ **v**

Generates a translation function for a literal:

```js
import { v } from 'nano-i18n';

v`Salut, ${0}!`;
// => function(strings, values) {}
```

When providing a translation, the interpolated values need to be numbers (i.e. `${0}`, `${1}`, et cetera). They don't necessarily need to be in sequential order, so you can swap them around if the translation needs it.

§ **t**

Get a translated string:

```js
import { t } from 'nano-i18n';

t`Hello, ${'Dan'}!`;
// => "Salut, Dan!"
```

If there's no translation available, it returns the normal interpolated string instead, and logs a warning to the console.

## Further reading

-   [i18n with tagged template literals in ECMAScript 2015](https://jaysoo.ca/2014/03/20/i18n-with-es2015-template-literals/) by Jack Hsu
-   [Easy i18n in 10 lines of JavaScript (PoC)](https://codeburst.io/easy-i18n-in-10-lines-of-javascript-poc-eb9e5444d71e) by Andrea Giammarchi
-   [i18n Tagged Template Literals](http://i18n-tag.kolmer.net/) by Steffen Kolmer
