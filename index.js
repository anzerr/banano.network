'use strict';


const packet = require('banano.parser');

const events = require('events'),
	dgram = require('dgram');

class Client extends events {

	constructor(config) {
		super();

		this.config = config || {};
		this.peer = config.peer;

		this.client = dgram.createSocket('udp4');
		this.client.on('error', (error) => {
			console.log('error', error);
		}).on('message', (message, rinfo) => {
			console.log('message', message, rinfo);
			let p = new packet.Buffer(message).toJson().get();
			console.log(p);
			console.log(message.toString('hex'));
		}).on('listening', () => {
			console.log('ready');
		});

		this.client.bind(this.config.port);
	}

	publish(data) {
		let b = new packet.Json(data).toBuffer(), p = b.get();
		console.log(b.toJson().get());
		for (let i in this.peer) {
			const t = this.peer[i].split(':');
			console.log('sent', t);
			this.client.send(p, t[1], t[0], (error) => {
				console.log(error);
			});
		}
	}

}

const c = new Client({
	maxPeers: 200,
	peer: [
		'tarzan.banano.co.in:7071'
	],
	cache: 'cache!peer.json'
});


c.publish({type: 'keepAlive'});
setInterval(() => {
	c.publish({type: 'keepAlive'});
}, 5000);
