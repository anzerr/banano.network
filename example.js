'use strict';

const packet = require('banano.parser');

const Client = require('./index.js');

const c = new Client({
	peer: ['tarzan.banano.co.in:7071']
}).on('publish', (/* packet*/) => { // get only publish pacekts
	// console.log(packet);
}).on('all', (packet) => { // get all packet types
	/* if (packet.type !== 'confirmReq' && packet.type !== 'keepAlive' && packet.type !== 'confirmAck') {
		console.log('get', packet);
	}*/
}).on('error', (err) => {
	// console.log(err);
}).on('ready', () => {
	console.log('ready');
	c.keepAlive();

	setTimeout(() => {
		c.keepAlive();
	}, 7000);

	setTimeout(() => {
		console.log('open tcp');
		c.peer.tcp(new packet.Json({
			type: 'frontierReq',
			start: Buffer.alloc(32).toString('hex'),
			age: 0xffffffff,
			count: 0xffffffff
		}).toBuffer().get()).then((res) => {
			console.log('done tcp', res);
		});
	}, 12000);

	setInterval(() => {
		c.keepAlive();

		/* .c.send({
				type: 'frontierReq',
				start: 'c7b5a6aab5a23079786ff694cf2cbf86304ef471cdded771497aeeef36e0ebfa',
				age: 0xffffffff,
				count: 0xffffffff
			});*/
	}, 30000);
});
