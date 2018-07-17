'use strict';

const url = require('url'),
	dns = require('dns'),
	Tcp = require('./tcp.js');

class Peer {

	constructor(client, address, config, score) {
		this._client = client;
		this._raw = address;
		this._score = score || 0;
		this._address = url.parse('tcp://' + address);
		dns.lookup(this._address.hostname, (err, add) => {
			if (!err) {
				this._address.hostname = add;
			}
		});
		this.config = config;
		this.alive = new Date().getTime() + config.get('aliveTime');
	}

	get() {
		return {
			address: this._address.hostname + ':' + this._address.port,
			score: this._score || 0
		};
	}

	score(n) {
		this.alive = new Date().getTime() + this.config.get('aliveTime');
		this._score += n;
		return this;
	}

	udp(buf) {
		return new Promise((resolve) => {
			this._client.send(buf, this._address.port, this._address.hostname, (res) => {
				resolve(res);
			});
		});
	}

	tcp(buf) {
		return new Tcp(buf, {
			host: this._address.hostname,
			port: this._address.port
		}, this.config).get();
	}

}

module.exports = Peer;
