'use strict';

const end = Buffer.alloc(32);

class frontierReq extends require('./base.js') {

	constructor(socket) {
		super();
		this._socket = socket;
		this._data = null;
		this._end = false;
	}

	push(packet) {
		console.log(packet);
		this._data = !this._data ? packet : Buffer.concat([this._data, packet]);
		let i = 0;
		while (this._data.length > 64 + i) {
			let account = this._data.slice(i, i + 32), hash = this._data.slice(i + 32, i + 64);
			if (account.equals(end) && hash.equals(end)) {
				this.destroy();
				break;
			}
			this.emit('data', {
				account: account.toString('hex'),
				hash: hash.toString('hex')
			});
			i += 64;
		}
		this._data = this._data.slice(i, this._data.length);
		if (this._data.length === 64 && this._data.slice(0, 32).equals(end) && this._data.slice(32, 64).equals(end)) {
			this.destroy();
		}
		return this;
	}

}

module.exports = frontierReq;
