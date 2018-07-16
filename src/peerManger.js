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
		if (this._peer[p].ping < now) {
			this._peer[p].ping = now + config.aliveTime * 0.25;
		}
		return this;
	}

	get(p) {
		return this._peer[p];
	}

	list(raw) {
		let o = [], now = new Date().getTime();
		for (let i in this._peer) {
			if (this._peer[i].ping > now) {
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

	send(buf) {
		let wait = [], now = new Date().getTime();
		for (let i in this._peer) {
			if (this._peer[i].ping > now) {
				wait.push(this._peer[i].send(buf));
			}
		}
		return Promise.all(wait);
	}

}

module.exports = PeerManger;
