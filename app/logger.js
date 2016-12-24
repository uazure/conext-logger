'use strict';

let config = require('../config');

module.exports = {
	debug: function() {
		if (config.verbosity >= 4) {
			console.log.apply(console, ['Debug'].concat(arguments));
		}
	},

	log: function() {
		if (config.verbosity >= 3) {
			console.log.apply(console, arguments);
		}
	},

	warn: function() {
		if (config.verbosity >= 2) {
			console.warn.apply(console, arguments);
		}
	},

	error: function() {
		if (config.verbosity >= 1) {
			console.error.apply(console, arguments);
		}
	}


}
