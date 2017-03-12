// Copyright (c) 2017 Sergii Popov
//
// GNU GENERAL PUBLIC LICENSE
//    Version 3, 29 June 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

'use strict';
let uuid = require('uuid');
let config = require('./config');
var deviceManager = require('./app/manager/device-manager');
var measurement = require('./app/model/measurement-model');
var logger = require('./app/logger');
var moment = require('moment');
var pubsub = require('./app/pubsub');
var shouldReportError = true;

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

var lastMeasurementIsMeaningful = {};

require('./app/telegram-bot');

function isUpdateNeeded(date, data) {
	let isLastMeaningful = lastMeasurementIsMeaningful[date];
	let isCurrentDataMeaningful = isDataMeaningful(data, date);
	let isRecordPresent = date in lastMeasurementIsMeaningful;

	if (isLastMeaningful && !isCurrentDataMeaningful) {
		pubsub.emit('lastMeasurement', data);
	}

	if (!isLastMeaningful && isCurrentDataMeaningful) {
		pubsub.emit('firstMeasurement', data);
	}

	lastMeasurementIsMeaningful[date] = isCurrentDataMeaningful;

	if (isCurrentDataMeaningful || !isRecordPresent || isLastMeaningful) {
		return true;
	}

	return false;
}

function isDataMeaningful(data, date) {
	if (data.some((inverterData) => {
		return inverterData.ac.power > 0 || inverterData.ac.online > 0;
	})) {
		lastMeasurementIsMeaningful[date] = data;

		return true;
	}

	return false;
}

module.exports = function() {
	var date = moment().format('YYYY-MM-DD');

	deviceManager.readAll()
		.then((data) => {
			logger.log('got data', data);
			shouldReportError = true;

			if (isUpdateNeeded(date, data)) {
				data.forEach((res) => {
					measurement.create(ConextModelConverter(res))
						.then(() => {
							logger.log('logged ok');
							pubsub.emit('measurementRecorded');
						});
				});
			} else {
				logger.log('no logging needed');
			}

		})
		.catch((err) => {
			if (shouldReportError) {
				pubsub.emit('readError', err);
			}
			logger.warn('Failed to read data from inverter', err);
			shouldReportError = false;
		});
};

if (require.main === module) {
	// called from console
	module.exports();
}
