'use strict';

class Config {

	constructor(config) {
		this._config = {
			aliveTime: 60 * 1000 * 5,
			tcpTimeout: 3000,
			tcpSlice: 10,
			dnsLoopup: false,
			aliveOnAdd: false,
			log: 0
		};
		for (let i in config) {
			this._config[i] = config[i];
		}
	}

	get(key) {
		return this._config[key];
	}

}

module.exports = Config;
