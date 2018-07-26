'use strict';

const {packet} = require('banano.parser'),
	events = require('events'),
	dgram = require('dgram'),
	Config = require('./src/Config.js'),
	PeerManger = require('./src/PeerManger.js');

class Client extends events {

	constructor(c) {
		super();

		this.config = new Config(c || {});
		this.client = dgram.createSocket('udp4');
		this.peer = new PeerManger()
			.withClient(this.client)
			.withConfig(this.config);

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
			this.peer.init();
			this.emit('ready');
		});

		this.client.bind(this.config.get('port'));
	}

	send(data) {
		return this.peer.udp(new packet.Json(data).toBuffer().get());
	}

	close() {
		if (this.client) {
			return new Promise((resolve) => {
				this.client.close(() => {
					this.client = null;
					resolve();
				});
			});
		}
		return Promise.resolve();
	}

	keepAlive() {
		this.send({type: 'keepAlive', peer: this.peer.getTop(8)});
	}

}

module.exports = Client;
