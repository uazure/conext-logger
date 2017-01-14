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

module.exports = function(dataArray) {
	var inverters = []; // intermediate object for storing data per inverter

	function getInverterObject(record) {
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

	dataArray.forEach(function(item) {
		var inverter = getInverterObject(item);
		var value = {
			createdAt: item.created_at,
			power: item.ac_power,
			dc1Power: item.dc1_power,
			dc2Power: item.dc2_power,
			voltage: item.ac_voltage,
			freq: item.ac_freq
		};

		inverter.values.push(value);
	});

	return inverters;
};
