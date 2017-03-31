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
let moment = require('moment');

module.exports = function(dataArray) {
	var inverters = []; // intermediate object for storing data per inverter

	dataArray.forEach(function(item) {
		var inverter = getInverterObject(inverters, item);
		var value = {
			date: item.date,
			energy: item.energy,
			totalEnergy: item.total_energy,
			duration: item.duration,
			totalDuration: item.total_duration
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
