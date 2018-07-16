'use strict';

const Client = require('./index.js');

const c = new Client({
	peer: ['tarzan.banano.co.in:7071']
}).on('publish', (/* packet*/) => { // get only publish pacekts
	// console.log(packet);
}).on('all', (packet) => { // get all packet types
	console.log('all', packet);
}).on('error', (err) => {
	console.log(err);
}).on('ready', () => {
	console.log('ready');
	c.keepAlive();

	setTimeout(() => {
		c.keepAlive();
	}, 10000);

	setInterval(() => {
		c.keepAlive();
	}, 30000);
});
