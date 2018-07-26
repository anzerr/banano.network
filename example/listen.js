'use strict';

const {packet} = require('banano.parser'),
	Client = require('../index.js');

const c = new Client({
	peer: ['tarzan.banano.co.in:7071']
}).on('publish', (/* packet*/) => {
	console.log(packet);
}).on('all', (p, who) => {
	console.log('get', who, p);
}).on('error', (err) => {
	console.log(err);
}).on('ready', () => {
	c.keepAlive();
	setInterval(() => {
		c.keepAlive();
	}, 30000);
});
