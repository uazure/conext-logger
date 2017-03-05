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

let inverterConfigModel = require('../model/inverter-config-model');
let moment = require('moment');
let logger = require('../logger');

function inverterConfigConverter(configs) {
	let result = configs.map((model) => {
		let resultModel = {
			inverterId: model.inverter_id,
			name: model.inverter_name,
			power: model.inverter_ac_power,
			startDate: model.inverter_start_date,
			dc: []
		};
		resultModel.dc.push({
			name: model.dc1_panel_name,
			startDate: model.dc1_panel_start_date,
			qty: model.dc1_panel_qty,
			power: model.dc1_panel_power,
			location: model.dc1_panel_location,
			tilt: model.dc1_panel_tilt,
			azimut: model.dc1_panel_azimut,
			voltageMax: model.dc1_panel_voltage_max,
			currentMax: model.dc1_panel_current_max,
			voltageNominal: model.dc1_panel_voltage_nominal,
			currentNominal: model.dc1_panel_current_nominal
		});

		if (model.dc2_panel_name) {
			resultModel.dc.push({
				name: model.dc2_panel_name,
				startDate: model.dc2_panel_start_date,
				qty: model.dc2_panel_qty,
				power: model.dc2_panel_power,
				location: model.dc2_panel_location,
				tilt: model.dc2_panel_tilt,
				azimut: model.dc2_panel_azimut,
				voltageMax: model.dc2_panel_voltage_max,
				currentMax: model.dc2_panel_current_max,
				voltageNominal: model.dc2_panel_voltage_nominal,
				currentNominal: model.dc2_panel_current_nominal
			});
		}

		return resultModel;
	});

	return result;
}

module.exports = {
	getInverterConfig: function(dateString) {
		let dateMoment = moment(dateString);
		let date = dateMoment.toDate();
		let promise = inverterConfigModel.findAll({
			where: {
				valid_from: {
					$lt: date
				},
				valid_to: {
					$or: {
						$gt: date,
						$eq: null
					}
				}
			}
		}).then(function(res) {
			if (res.length == 0) {
				return null;
			}

			let result = inverterConfigConverter(res);
			// convert to key-value

			let config = {};
			result.forEach((inv) => {
				config[inv.inverterId] = {};
				Object.assign(config[inv.inverterId], inv);
				delete config[inv.inverterId].inverterId;
			});
			logger.debug('Config is', config);

			return config;
		});

		return promise;
	}
}
