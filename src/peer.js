'use strict';

const url = require('url'),
	dns = require('dns'),
	Tcp = require('./tcp.js'),
	util = require('./util.js');

class Peer extends require('./base.js') {

	constructor(address, score) {
		super();
		this._raw = address;
		this._score = score || 0;
		this._address = url.parse('tcp://' + address);
	}

	withClient(client) {
		this.client = client;
		return this;
	}

	init() {
		if (this.config.get('dnsLoopup')) {
			dns.lookup(this._address.hostname, (err, add) => {
				if (!err) {
					if (this._address.hostname !== add) {
						this.log(7, 'lookup for', this._address.hostname, 'is', add);
					}
					this._address.hostname = add;
				} else {
					this.log(7, 'error lookup on', this._address.hostname, 'is it valid?');
				}
			});
		}
		this.alive = util.now(this.config.get('aliveTime'));
		return this;
	}

	address() {
		return this._address.hostname + ':' + this._address.port;
	}

	get() {
		return {address: this.address(), score: this._score || 0};
	}

	score(n) {
		this.alive = util.now(this.config.get('aliveTime'));
		this._score += n;
		return this;
	}

	udp(buf) {
		return new Promise((resolve) => {
			this.client.send(buf, this._address.port, this._address.hostname, (res) => {
				resolve(res);
			});
		});
	}

	tcp(buf) {
		return new Tcp(this._address.hostname, this._address.port)
			.withConfig(this.config)
			.get(buf);
	}

}

module.exports = Peer;
