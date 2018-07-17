'use strict';

const net = require('net'),
	packet = require('banano.parser');

const type = {
	frontierReq: require('./tcp/frontierReq.js'),
};

class Tcp {

	constructor(buf, address, config) {
		this._buf = buf;
		this._address = address;
		this._type = packet.util.packetType(buf);
		this.config = config;
	}

	get() {
		let Handle = type[this._type];
		if (!Handle) {
			return Promise.reject(new Error('type is not handled'));
		}
		return new Promise((resolve) => {
			let socket = net.createConnection(this._address.port, this._address.host, () => {
				socket.write(this._buf);
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
