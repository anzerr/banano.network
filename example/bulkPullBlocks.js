'use strict';

const {packet} = require('banano.parser'),
	Client = require('../index.js');

const c = new Client({
	peer: [], // can add peers here
}).on('ready', () => {
	c.peer.add('tarzan.banano.co.in:7071'); // or like this

	let req = c.peer.get('tarzan.banano.co.in:7071').tcp(new packet.Json({
		type: 'bulkPullBlocks',
		min: Buffer.alloc(32),
		max: Buffer.alloc(32, 16),
		mode: 0,
		count: 0xffffffff
	}).toBuffer().get());

	req.on('data', (res) => {
		console.log(res);
	});
	req.on('end', () => {
		console.log('end');
		c.close();
	});
});
