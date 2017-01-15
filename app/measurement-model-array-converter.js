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

module.exports = {};

module.exports.brief = function(dataArray) {
	this.full(dataArray).forEach((inveterData) => {
		inverterData.values = inverterData.values.map((value) => {
			return {
				createdAt: value.createdAt,
				power: value.power,
				dc1Power: dc1Power,
				dc2Power: dc2Power
			}
		});
	});
};

module.exports.full = function(dataArray) {
	var inverters = []; // intermediate object for storing data per inverter

	dataArray.forEach(function(item) {
		var inverter = getInverterObject(inverters, item);
		var value = {
			createdAt: item.created_at,
			power: item.ac_power,
			dc1Power: item.dc1_power,
			dc2Power: item.dc2_power,
			dc1Voltage: item.dc1_voltage,
			dc2Voltage: item.dc2_voltage,
			dc1Current: item.dc1_current,
			dc2Current: item.dc2_current,
			voltage: item.ac_voltage,
			current: item.ac_current,
			freq: item.ac_freq,
			duration: item.duration,
			energy: item.ac_energy,
			totalDuration: item.total_duration,
			totalEnergy: item.total_energy
		};

		inverter.values.push(value);
	});

	return inverters;
};

function getInverterObject(inverters, record) {
	var result;

	inverters.some(function(item) {
		if (item.inverterId == record.inverter_id) {
			result = item;
			return true;
		}

		return false;
	});

	if (!result) {
		result = {
			inverterId: record.inverter_id,
			values: []
		};
		inverters.push(result);
	}

	return result;
};
