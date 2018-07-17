'use strict';

const socketEnd = Buffer.alloc(64);

class frontierReq {

	constructor(socket) {
		this._socket = socket;
		this._data = [];
	}

	push(packet) {
		this._data.push(packet);
		if (packet.slice(packet.length - 64, packet.length).equals(socketEnd)) {
			this._socket.end();
		}
		return this;
	}

	json() {
		let out = [], payload = Buffer.concat(this._data), zeroed = Buffer.alloc(64);
		for (let i = 0; i < payload.length; i += 64) {
			let account = payload.slice(i, i + 32), hash = payload.slice(i + 32, i + 64);
			if (account.equals(zeroed) && hash.equals(zeroed)) {
				break;
			} else if (account.length === 32 && hash.length === 32) {
				out.push({account: account.toString('hex'), hash: hash.toString('hex')});
			}
		}
		return out;
	}

}

module.exports = frontierReq;
