'use strict';

const {packet, util} = require('banano.parser');

class frontierReq extends require('./base.js') {

	constructor(socket) {
		super();
		this._socket = socket;
		this._data = null;
		this._end = false;
	}

	push(p) {
		this._data = !this._data ? p : Buffer.concat([this._data, p]);
		let i = 0;
		while (i < this._data.length) {
			let type = this._data[i];
			if (util.blockType(type) === 'notBlock') {
				this.destroy();
				break;
			} else {
				let size = util.getBlockSize(this._data[i]) + 1, buf = Buffer.concat([
					util.createHeader({type: 'publish', extensions: type}),
					this._data.slice(i + 1, i + size)
				]);
				let out = new packet.Buffer(buf, {skipValidation: true}).toJson().get();
				if (out && out.block) {
					this.emit('data', out.block);
				}
				i += size;
			}
		}
		this._data = this._data.slice(i, this._data.length);
		return this;
	}

}

module.exports = frontierReq;
