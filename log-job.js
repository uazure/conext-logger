'use strict';
let uuid = require('uuid');
let config = require('./config');
// let ConextReader = require('./app/conext-rl-module');
var deviceManager = require('./app/device-manager');
// ConextReader = require('./app/mock/conext-rl-module');
var measurement = require('./app/measurement-model');
var logger = require('./app/logger');


var ConextModelConverter = function(conextModel) {
	let model = {};
	model.id = uuid.v4();
	model.inverter_id = conextModel.inverterId;
	model.dc1_voltage = conextModel.dc[0].voltage;
	model.dc1_current = conextModel.dc[0].current;
	model.dc1_power = conextModel.dc[0].power;
	model.dc1_energy = conextModel.dc[0].energy;
	model.dc2_voltage = conextModel.dc[1].voltage;
	model.dc2_current = conextModel.dc[1].current;
	model.dc2_power = conextModel.dc[1].power;
	model.dc2_energy = conextModel.dc[1].energy;

	model.ac_voltage = conextModel.ac.voltage;
	model.ac_current = conextModel.ac.current;
	model.ac_power = conextModel.ac.power;
	model.ac_energy = conextModel.ac.energy;
	model.ac_freq = conextModel.ac.freq;

	model.duration = conextModel.ac.duration;
	model.total_energy = conextModel.ac.totalEnergy;
	model.total_duration = conextModel.ac.totalDuration;
	model.state = conextModel.ac.state;
	return model;
};


module.exports = function() {

	deviceManager.readAll()
		.then((data) => {
			logger.log('got data', data);
			data.forEach((res) => {
				measurement.create(ConextModelConverter(res))
					.then(() => {
						logger.log('logged ok');
					});
			})

		})
		.catch((err) => {
			logger.warn('Failed to read data from inverter', err);
		});
}

if (require.main === module) {
	// called from console
	module.exports();
}
