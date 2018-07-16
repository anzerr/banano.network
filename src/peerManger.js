'use strict';

const Peer = require('./Peer.js'),
	config = require('./config.js');

class PeerManger {

	constructor(client, p) {
		if (!Array.isArray(p)) {
			throw new Error('peer list is not a array');
		}
		this._client = client;
		this._peer = {};
		for (let i in p) {
			this.add(p[i]);
		}
	}

	score(p) {
		if (this._peer[p]) {
			this._peer[p].score(1);
		}
	}

	add(p) {
		if (!this._peer[p]) {
			this._peer[p] = new Peer(this._client, p);
			return this;
		}
		let now = new Date().getTime();
		if (this._peer[p].alive < now) {
			this._peer[p].alive = now + config.aliveTime * 0.25;
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
		let list = [], res = [], run = () => {
			let wait = [], l = list.splice(0, 10);
			console.log(l);
			if (l.length === 0) {
				return res;
			}
			for (let i in l) {
				wait.push(this._peer[l[i]].tcp(buf));
			}
			return Promise.all(wait).then((r) => {
				console.log(r);
				res = res.concat(r);
				return run();
			});
		};
		for (let i in this._peer) {
			list.push(i);
		}
		console.log(list);
		return run();
	}

}

module.exports = PeerManger;
