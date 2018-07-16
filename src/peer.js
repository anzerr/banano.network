'use strict';

const url = require('url'),
	dns = require('dns'),
	config = require('./config.js');

class Peer {

	constructor(client, address, score) {
		this._client = client;
		this._raw = address;
		this._address = url.parse('tcp://' + address);
		dns.lookup(this._address.hostname, (err, add) => {
			if (!err) {
				this._address.hostname = add;
			}
		});
		this.ping = new Date().getTime() + config.aliveTime;
		this._score = score || 0;
	}

	get() {
		return {
			address: this._address.hostname + ':' + this._address.port,
			score: this._score || 0
		};
	}

	score(n) {
		this.ping = new Date().getTime() + config.aliveTime;
		this._score += n;
		return this;
	}

	send(buf) {
		return new Promise((resolve) => {
			this._client.send(buf, this._address.port, this._address.hostname, (res) => {
				resolve(res);
			});
		});
	}

}

module.exports = Peer;
