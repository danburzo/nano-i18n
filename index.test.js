let tape = require('tape');
let { k, v, t, load, clear, config } = require('./dist/index.js');

tape('k', test => {
	test.equal(k`Hello, ${'World'}`, 'Hello, {}');
	test.equal(k`Hello, ${0}`, 'Hello, {}');
	test.equal(k`My name is ${0}, your name is ${1}`, 'My name is {}, your name is {}');
	test.equal(k`Hello World`, 'Hello World');
	test.end();
});

tape('v', test => {
	test.equal(typeof v`Hello, ${0}`, 'function');
	test.end();
});

tape('t', test => {
	clear();
	load(k`Hello, ${'World'}!`, v`Salut, ${0}!`);
	load(k`My name is ${0}, your name is ${1}`, v`Numele meu este ${0}, al tău este ${1}`);
	load(k`I am ${0}, you are ${1}`, v`You are ${1}, I am ${0}`);
	load('Simple string', 'Șir simplu');
	load('Another simple string', v`Alt șir simplu`);

	test.equal(t`Hello, ${'Dan'}!`, 'Salut, Dan!');
	test.equal(
		t`My name is ${'Dan'}, your name is ${'Alex'}`,
		'Numele meu este Dan, al tău este Alex'
	);
	test.equal(t`I am ${'Dan'}, you are ${'Alex'}`, 'You are Alex, I am Dan');
	test.equal(t`Simple string`, 'Șir simplu');
	test.equal(t(['Simple string']), 'Șir simplu');
	test.equal(t('Simple string'), 'Șir simplu');
	test.equal(t('Another simple string'), 'Alt șir simplu');
	test.equal(t`Another simple string`, 'Alt șir simplu');
	test.end();
});

tape('load and clear', test => {
	clear();
	load(k`Hello, ${'World'}!`, v`Salut, ${0}!`);
	test.equal(t`Hello, ${'Dan'}!`, 'Salut, Dan!');
	clear();
	test.equal(t`Hello, ${'Dan'}!`, 'Hello, Dan!');
	test.end();
});

tape('config', test => {
	clear();
	config({ log: 1 });
	test.equal(t('Hello World'), 'Hello World');
	config({ log: 2 });
	test.throws(() => {
		t('Hello World');
	}, /No translation found/);
	config({ log: 0 });

	config({ placeholder: '@@' });
	test.equal(k`Hello, ${'World'}`, 'Hello, @@');
	config({ placeholder: '{}' });

	test.end();
});
