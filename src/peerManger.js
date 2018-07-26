'use strict';

const {packet} = require('banano.parser'),
	Peer = require('./Peer.js'),
	util = require('./util.js');

class PeerManger extends require('./base.js') {

	constructor() {
		super();
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
			this.log(7, 'peer', p, 'add score');
			this._peer[p].score(1);
		}
	}

	add(p) {
		if (!this._peer[p]) {
			this.log(6, 'added peer', p);
			this._peer[p] = new Peer(p)
				.withClient(this.client)
				.withConfig(this.config)
				.init();
			if (this.config.get('aliveOnAdd')) {
				this._peer[p].udp(new packet.Json({
					type: 'keepAlive',
					peer: this.getTop(8)
				}).toBuffer().get());
			}
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

	getTop(c) {
		let cap = c || 8, hcap = Math.floor(cap / 2);
		let list = this.list(), top = list.slice(0, hcap), got = {};
		for (let i = 0; i < (cap * 2); i++) {
			let n = Math.floor(Math.random() * (list.length - hcap)) + hcap, l = list[n];
			if (l && !got[n]) {
				top.push(l);
				got[n] = true;
			}
			if (top.length >= cap) {
				break;
			}
		}
		return top.splice(0, cap);
	}

	udp(buf) {
		let wait = [];
		this.forEach((p) => {
			this.log(7, 'sent packet to', p.address(), 'type', buf[5]);
			wait.push(p.udp(buf));
		});
		return Promise.all(wait);
	}

}

module.exports = PeerManger;
