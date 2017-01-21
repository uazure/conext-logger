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

let d3 = require('d3-array');
let uuid = require('uuid');
let MEASUREMENT_INTERVAL_THRESHOLD = 90000; // 90 seconds to catch measurements that are made within 1 minute
let DEFAULT_DURATION = 60000;

/**
	function to process measurements data got by measurementRepository.full()
	returns array with models ready to be inserted to db;

*/

// accepts array of arrays where first value is date and second is power
function calculateTotalEnergy(values) {
	var energy = values.reduce((value, item, index, array) => {
		if (index === 0) {
			return value;
		}

		let prevItem = array[index-1];
		let duration = item[0] - prevItem[0];

		if (duration > MEASUREMENT_INTERVAL_THRESHOLD) {
			duration = DEFAULT_DURATION;
		}

		return value + duration / 1000 * prevItem[1] / 3600;
	}, 0);

	return energy
}

module.exports = function(targetDate, data) {
	var response = [];

	data.forEach((inverter) => {
		let model = {};
		model.id = uuid.v4();
		model.inverter_id = inverter.inverterId;
		model.date = targetDate;
		//other fields are:
		// dc1_power_max dc1_energy  dc2_power_max dc2_energy duration energy total_energy total_duration
		model.dc1_power_max = d3.max(inverter.values, (value) => { return value.dc1Power; });
		model.dc2_power_max = d3.max(inverter.values, (value) => { return value.dc2Power; });
		model.power_max = d3.max(inverter.values, (value) => { return value.power; });
		model.duration = d3.max(inverter.values, (value) => { return value.duration; });
		model.energy = (inverter.values[inverter.values.length-1].totalEnergy) - (inverter.values[0].totalEnergy);
		model.total_energy = d3.max(inverter.values, (value) => { return value.totalEnergy; });
		model.total_duration = d3.max(inverter.values, (value) => { return value.totalDuration; });

		let dc1Energy = calculateTotalEnergy(inverter.values.map((value) => {return [value.createdAt, value.dc1Power]}));
		let dc2Energy = calculateTotalEnergy(inverter.values.map((value) => {return [value.createdAt, value.dc2Power]}));
		let dcEnergy = dc1Energy + dc2Energy;

		model.dc1_energy = Number((model.energy * dc1Energy / dcEnergy).toFixed(3));
		model.dc2_energy = Number((model.energy * dc2Energy / dcEnergy).toFixed(3));
		model.energy = Number(model.energy.toFixed(3));

		response.push(model);
	});

	return response;
}
