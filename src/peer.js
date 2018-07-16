'use strict';

const net = require('net'),
	url = require('url'),
	dns = require('dns'),
	config = require('./config.js');

class Peer {

	constructor(client, address, score) {
		this._client = client;
		this._raw = address;
		this._address = url.parse('tcp://' + address);
		dns.lookup(this._address.hostname, (err, add) => {
			if (!err) {
				this._address.hostname = add;
			}
		});
		this.alive = new Date().getTime() + config.aliveTime;
		this._score = score || 0;
	}

	get() {
		return {
			address: this._address.hostname + ':' + this._address.port,
			score: this._score || 0
		};
	}

	score(n) {
		this.alive = new Date().getTime() + config.aliveTime;
		this._score += n;
		return this;
	}

	udp(buf) {
		return new Promise((resolve) => {
			this._client.send(buf, this._address.port, this._address.hostname, (res) => {
				resolve(res);
			});
		});
	}

	tcp(buf) {
		return new Promise((resolve) => {
			let socket = net.createConnection(this._address.port, this._address.hostname, () => {
				socket.write(buf);
			});

			let data = [], done = false, cd = () => {
				if (!done) {
					done = true;
					socket.destroy();
					resolve(Buffer.concat(data));
				}
			};
			socket.on('data', (packet) => {
				data.push(packet);

				if (packet.slice(packet.length - 64, packet.length).equals(config.endPacket)) {
					socket.end();
				}
			}).on('error', cd).on('end', cd).on('timeout', cd);
			socket.setTimeout(3000);
		});
	}

}

module.exports = Peer;
