'use strict';
let measurement = require('./app/measurement-model');
let converter = require('./app/measurement-model-converter');

measurement.findAll()
	.then((data) => {
		let item = data[0];
		converter(item);
	});
