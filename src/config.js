'use strict';

class Config {

	constructor(config) {
		this._config = {
			aliveTime: 60 * 1000 * 5,
			tcpTimeout: 3000,
			tcpCap: 10,
			dnsLoopup: true
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
