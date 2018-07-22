'use strict';

const Peer = require('./Peer.js'),
	util = require('./util.js');

class PeerManger {

	constructor() {}

	withConfig(config) {
		this.config = config;
		return this;
	}

	withClient(client) {
		this.client = client;
		return this;
	}

	init() {
		let peers = this.config.get('peer');
		if (!Array.isArray(peers)) {
			throw new Error('peer list is not a array');
		}
		this._peer = {};
		for (let i in peers) {
			this.add(peers[i]);
		}
		return this;
	}

	score(p) {
		if (this._peer[p]) {
			this._peer[p].score(1);
		}
	}

	add(p) {
		if (!this._peer[p]) {
			this._peer[p] = new Peer(p)
				.withClient(this.client)
				.withConfig(this.config)
				.init();
			return this;
		}
		let now = util.now();
		if (this._peer[p].alive < now) {
			this._peer[p].alive = now + this.config.get('aliveTime') * 0.25;
		}
		return this;
	}

	get(p) {
		return this._peer[p];
	}

	forEach(func) {
		let now = util.now();
		for (let i in this._peer) {
			if (this._peer[i].alive > now) {
				func(this._peer[i], i);
			}
		}
		return this;
	}

	list(raw) {
		let o = [];
		this.forEach((p) => {
			o.push(p.get());
		});
		o.sort((a, b) => {
			return b.score - a.score;
		});
		if (!raw) {
			for (let i in o) {
				o[i] = o[i].address;
			}
		}
		return o;
	}

	udp(buf) {
		let wait = [];
		this.forEach((p) => {
			wait.push(p.udp(buf));
		});
		return Promise.all(wait);
	}

	tcp(buf) {
		let list = [], res = {}, run = () => {
			let wait = [], l = list.splice(0, this.config.get('tcpCap'));
			if (l.length === 0) {
				return res;
			}
			for (let i in l) {
				((ip) => {
					wait.push(this._peer[l[i]].tcp(buf).then((r) => {
						return {[ip]: r};
					}));
				})(l[i]);
			}
			return Promise.all(wait).then((r) => {
				for (let i in r) {
					for (let x in r[i]) {
						res[x] = r[i][x];
					}
				}
				return run();
			});
		};
		this.forEach((p, k) => {
			list.push(k);
		});
		return run();
	}

}

module.exports = PeerManger;
