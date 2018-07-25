'use strict';

class Base extends require('events') {

	withConfig(config) {
		this.config = config;
		return this;
	}

	destroy() {
		try {
			if (this._socket) {
				this._socket.destroy();
				this._socket = null;
			}
			// maybe a good idea for clean up?
			// this._data = null;
		} catch(e) {
			// we tryed :)
		}
		if (!this._end) {
			this._end = true;
			this.emit('end');
			this.removeAllListeners('end');
			this.removeAllListeners('write');
		}
		return this;
	}

	end() {
		return this.destroy();
	}

}

module.exports = Base;
