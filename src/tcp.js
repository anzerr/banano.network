'use strict';

const net = require('net'),
	{util} = require('banano.parser');

const type = {
	frontierReq: require('./tcp/frontierReq.js'),
	bulkPull: require('./tcp/bulkPull.js')
};

class Tcp {

	constructor(host, port) {
		this._address = {host, port};
	}

	withConfig(config) {
		this.config = config;
		return this;
	}

	get(buf) {
		let Handle = type[util.packetType(buf)];
		if (!Handle) {
			return Promise.reject(new Error('type is not handled'));
		}
		return new Promise((resolve) => {
			let socket = net.createConnection(this._address.port, this._address.host, () => {
				socket.write(buf);
			});

			let data = new Handle(socket), done = false, cd = () => {
				if (!done) {
					done = true;
					socket.destroy();
					resolve(data.json());
				}
			};
			socket.on('data', (d) => {
				data.push(d);
			}).on('error', cd).on('end', cd).on('timeout', cd);
			socket.setTimeout(this.config.get('tcpTimeout'));
		});
	}

}

module.exports = Tcp;
