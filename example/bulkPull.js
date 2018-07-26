'use strict';

const {packet} = require('banano.parser'),
	Client = require('../index.js'),
	account = require('banano.account');

const c = new Client({
	peer: [], // can add peers here
}).on('ready', () => {
	c.peer.add('tarzan.banano.co.in:7071'); // or like this

	console.log(account.getAccountPublic('fed51a583925a4fb4d131ea5adcca23378d572501798dbdcf7d0973507547368'));
	let req = c.peer.get('tarzan.banano.co.in:7071').tcp(new packet.Json({
		type: 'bulkPull',
		account: 'fed51a583925a4fb4d131ea5adcca23378d572501798dbdcf7d0973507547368',
		end: 'D1FFADE2A0189BDC252F18470C2F0A1EF6D49840A0153B3834FE89D949844D2F' // get from this block to the nodes frontier
	}).toBuffer().get());

	req.on('data', (res) => {
		console.log(res);
	});
	req.on('end', () => {
		console.log('end');
		c.close();
	});
});
