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

/**
	function to process measurements data got by measurementRepository.full()
	returns array with models ready to be inserted to db;

*/
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
		model.dc1_energy = 0; // FIXME: need to implement
		model.dc2_energy = 0; // FIXME
		model.duration = d3.max(inverter.values, (value) => { return value.duration; });
		model.energy = d3.max(inverter.values, (value) => { return value.energy; });
		model.total_energy = d3.max(inverter.values, (value) => { return value.totalEnergy; });
		model.total_duration = d3.max(inverter.values, (value) => { return value.totalDuration; });

		response.push(model);
	});

	return response;
}
