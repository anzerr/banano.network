'use strict';

const {packet} = require('banano.parser'),
	account = require('banano.account');

const Client = require('./index.js');

const c = new Client({
	peer: ['tarzan.banano.co.in:7071'],
	log: 0
}).on('publish', (/* packet*/) => { // get only publish pacekts
	// console.log(packet);
}).on('all', (p, who) => { // get all packet types
	/* if (packet.type !== 'confirmReq' && packet.type !== 'keepAlive' && packet.type !== 'confirmAck') {
		console.log('get', packet);
	}*/
	// console.log('get', who, p);
}).on('error', (err) => {
	console.log(err);
}).on('ready', () => {
	console.log('ready');
	c.keepAlive();

	setTimeout(() => {
		c.keepAlive();
	}, 7000);

	console.log(account.getAccountPublic('fed51a583925a4fb4d131ea5adcca23378d572501798dbdcf7d0973507547368'));
	// let acc = account.getAccountHex('ban_16ijyr373pf98rkw4fpy14ttdui58n3znbdpaxxdbhjgbosbnkc1qcyguh6u');
	// console.log(acc, acc.length);
	setTimeout(() => {
		let frontierReq = false;
		if (frontierReq) {
			console.log('tcp frontier');
			let peer = c.peer.get('tarzan.banano.co.in:7071');
			let req = peer.tcp(new packet.Json({
				type: 'frontierReq',
				account: 'fed51a583925a4fb4d131ea5adcca23378d572501798dbdcf7d0973507547368',
				age: 0xffffffff,
				count: 0xffffffff
			}).toBuffer().get());

			req.on('data', (res) => {
				console.log(res);
				req.end(); // end socket as soon as posible
			});
			req.on('end', () => {
				console.log('end');
			});
		}

		/*
		{ account:
   'fed51a583925a4fb4d131ea5adcca23378d572501798dbdcf7d0973507547368',
  hash:
   'd60134b773c17a03f4580d9b6b705929e1f8636a8d257b4586eb3cd2a1990d03' }
		 */
		let bulkPull = true;
		if (bulkPull) {
			console.log('tcp bulkPull');
			console.log({
				account: 'fed51a583925a4fb4d131ea5adcca23378d572501798dbdcf7d0973507547368',
				end: 'D1FFADE2A0189BDC252F18470C2F0A1EF6D49840A0153B3834FE89D949844D2F',
			});
			let peer = c.peer.get('tarzan.banano.co.in:7071');
			let req = peer.tcp(new packet.Json({
				type: 'bulkPull',
				account: 'fed51a583925a4fb4d131ea5adcca23378d572501798dbdcf7d0973507547368',
				end: 'D1FFADE2A0189BDC252F18470C2F0A1EF6D49840A0153B3834FE89D949844D2F', // 'd60134b773c17a03f4580d9b6b705929e1f8636a8d257b4586eb3cd2a1990d03'
			}).toBuffer().get());

			req.on('data', (res) => {
				console.log(res);
				// req.end(); // end socket as soon as posible
			});
			req.on('end', () => {
				console.log('end');
			});
		}

		/* c.frontierReq({
			account: 'fed51a583925a4fb4d131ea5adcca23378d572501798dbdcf7d0973507547368',
			// age: 0xf,
			count: 0
		}, {
			utilResponse: true,
			tcpSlice: 1
		}).then((res) => {
			let out = {}, ai = 0;
			for (let i in res) {
				for (let x in res[i]) {
					let pub = res[i][x].account, h = res[i][x].hash;
					if (!out[pub]) {
						out[pub] = {};
						ai += 1;
					}
					out[pub][h] = (out[pub][h] || 0) + 1;
				}
			}
			console.log('frontier', out, ai);
		}).catch((err) => {
			console.log('something went wrong', err);
		});*/
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
