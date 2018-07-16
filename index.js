'use strict';

const packet = require('banano.parser'),
	events = require('events'),
	dgram = require('dgram'),
	PeerManger = require('./src/PeerManger.js');

class Client extends events {

	constructor(config) {
		super();

		this.config = config || {};

		this.client = dgram.createSocket('udp4');
		this.client.on('error', (error) => {
			this.emit('error', error);
		}).on('message', (message, rinfo) => {
			try {
				this.peer.score(rinfo.address + ':' + rinfo.port);
				let p = new packet.Buffer(message).toJson().get();
				if (p.type === 'keepAlive') {
					for (let i in p.body) {
						this.peer.add(p.body[i]);
					}
				}
				this.emit('all', p);
				this.emit(p.type, p);
			} catch (e) {
				this.emit('error', e);
			}
		}).on('listening', () => {
			this.emit('ready');
		});

		this.peer = new PeerManger(this.client, config.peer || []);
		this.client.bind(this.config.port);
	}

	send(data) {
		console.log('send', data, new packet.Json(data).toBuffer().get());
		return this.peer.udp(new packet.Json(data).toBuffer().get());
	}

	keepAlive() {
		let list = this.peer.list(), top = list.slice(0, 4), got = {};
		for (let i = 0; i < 16; i++) {
			let n = Math.floor(Math.random() * (list.length - 4)) + 4, l = list[n];
			if (l && !got[n]) {
				top.push(l);
				got[n] = true;
			}
			if (top.length >= 8) {
				break;
			}
		}
		this.send({type: 'keepAlive', body: top.splice(0, 8)});
	}

}

module.exports = Client;
