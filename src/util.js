'use strict';

module.exports = {

	now(n) {
		return new Date().getTime() + (n || 0);
	}

};
