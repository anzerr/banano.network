'use strict';

const {packet} = require('banano.parser'),
	events = require('events'),
	dgram = require('dgram'),
	Config = require('./src/Config.js'),
	util = require('./src/util.js'),
	PeerManger = require('./src/PeerManger.js');

class Client extends events {

	constructor(c) {
		super();

		this.config = new Config(c || {});

		this.client = dgram.createSocket('udp4');
		this.client.on('error', (error) => {
			this.emit('error', error);
		}).on('message', (message, rinfo) => {
			let who = rinfo.address + ':' + rinfo.port, p = null;
			try {
				this.peer.score(who);
				p = new packet.Buffer(message).toJson().get();
				if (p.type === 'keepAlive') {
					for (let i in p.peer) {
						this.peer.add(p.peer[i]);
					}
				}
			} catch (e) {
				this.emit('error', e);
			}
			if (p) {
				this.emit('all', p, who);
				this.emit(p.type, p, who);
			}
		}).on('listening', () => {
			this.emit('ready');
		});

		this.peer = new PeerManger()
			.withClient(this.client)
			.withConfig(this.config)
			.init();

		this.client.bind(this.config.get('port'));
	}

	send(data) {
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
		this.send({type: 'keepAlive', peer: top.splice(0, 8)});
	}

}

module.exports = Client;
