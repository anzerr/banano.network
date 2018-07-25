'use strict';

class Base {

	log(level, ...args) {
		if (this.config && level < this.config.get('log')) {
			console.log.apply(console.log, args);
		}
	}

	withConfig(config) {
		this.config = config;
		return this;
	}

}

module.exports = Base;
