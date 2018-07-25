'use strict';

const net = require('net'),
	{util} = require('banano.parser');

const type = {
	frontierReq: require('./tcp/frontierReq.js'),
	bulkPull: require('./tcp/bulkPull.js')
};

class Tcp extends require('./base.js') {

	constructor(host, port) {
		super();
		this._address = {host, port};
	}

	get(buf) {
		let Handle = type[util.packetType(buf)];
		if (!Handle) {
			throw new Error('type is not handled');
		}
		let socket = net.createConnection(this._address.port, this._address.host, () => {
			console.log(buf);
			socket.write(buf);
		});

		let data = new Handle(socket)
			.withConfig(this.config);

		let close = () => {
			data.destroy();
		};
		socket.on('data', (packet) => {
			data.push(packet);
		}).on('error', close)
			.on('end', close)
			.on('timeout', close)
			.setTimeout(this.config.get('tcpTimeout'));

		return data;
	}

}

module.exports = Tcp;
