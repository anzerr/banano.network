'use strict';

const Peer = require('./Peer.js');

class PeerManger {

	constructor(client, config) {
		this.config = config;
		let peers = this.config.get('peer');
		if (!Array.isArray(peers)) {
			throw new Error('peer list is not a array');
		}
		this._client = client;
		this._peer = {};
		for (let i in peers) {
			this.add(peers[i]);
		}
	}

	score(p) {
		if (this._peer[p]) {
			this._peer[p].score(1);
		}
	}

	add(p) {
		if (!this._peer[p]) {
			this._peer[p] = new Peer(this._client, p, this.config);
			return this;
		}
		let now = new Date().getTime();
		if (this._peer[p].alive < now) {
			this._peer[p].alive = now + this.config.get('aliveTime') * 0.25;
		}
		return this;
	}

	get(p) {
		return this._peer[p];
	}

	list(raw) {
		let o = [], now = new Date().getTime();
		for (let i in this._peer) {
			if (this._peer[i].alive > now) {
				o.push(this._peer[i].get());
			}
		}
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
		let wait = [], now = new Date().getTime();
		for (let i in this._peer) {
			if (this._peer[i].alive > now) {
				wait.push(this._peer[i].udp(buf));
			}
		}
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
		for (let i in this._peer) {
			list.push(i);
		}
		return run();
	}

}

module.exports = PeerManger;
