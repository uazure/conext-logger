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

let inverterConfigModel = require('./app/model/inverter-config-model');

(function() {
	let date = new Date('2017-04-05');
	let inverterId = 1;

	let result = inverterConfigModel.update({valid_to: date}, {
		where: {
			inverter_id: inverterId,
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
	});

	result.then((res) => {
		console.log('update result', res);
		inverterConfigModel.create({
			valid_from: date,
			valid_to: null, // has no expire date, active now
			inverter_id: inverterId,
			dc2_panel_name: 'Yabang Solar YBP-250-60',
			dc2_panel_start_date: new Date(2016, 2, 27), // March 27, 2016
			dc2_panel_qty: 6, // quantity of the panels used in the array
			dc2_panel_power: 250, // nominal power of single panel, Watts
			dc2_panel_location: 'Garage roof',
			dc2_panel_tilt: 36,
			dc2_panel_azimut: 184,
			dc2_panel_voltage_max: 37.54, // open circuit voltage
			dc2_panel_current_max: 8.84, // short circuit current
			dc2_panel_voltage_nominal: 29.98, // max power voltage (at standart testing conditions, STC)
			dc2_panel_current_nominal: 8.34, // max power current (at STC)
			// dc1_panel_name: 'Abi Solar CL-P60250',
			// dc1_panel_start_date: new Date(2016, 6, 1), // July 1, 2016
			// dc1_panel_qty: 6,
			// dc1_panel_power: 250,
			// dc1_panel_location: 'Garage roof',
			// dc1_panel_tilt: 36,
			// dc1_panel_azimut: 184,
			// dc1_panel_voltage_max: 36.3,
			// dc1_panel_current_max: 8.71,
			// dc1_panel_voltage_nominal: 30.6,
			// dc1_panel_current_nominal: 8.17,
			inverter_name: 'Conext RL 3000',
			inverter_ac_power: 3,
			inverter_start_date: new Date(2016, 2, 27) // March 27, 2016
		});
	});

}());


(function() {
	let date = new Date('2017-04-05');
	let inverterId = 2;
	/**
	It's just an example config that initializes inverter configuration record
	*/

	let result = inverterConfigModel.update({valid_to: date}, {
		where: {
			inverter_id: inverterId,
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
	});

	result.then((res) => {
		console.log('update result', res);
		inverterConfigModel.create({
			valid_from: date,
			valid_to: null, // has no expire date, active now
			inverter_id: 2,
			dc1_panel_name: 'GPPV GPM310P-B-72',
			dc1_panel_start_date: new Date(2016, 7, 22), // August 22, 2016
			dc1_panel_qty: 6, // quantity of the panels used in the array
			dc1_panel_power: 310, // nominal power of single panel, Watts
			dc1_panel_location: 'House antechamber roof',
			dc1_panel_tilt: 28,
			dc1_panel_azimut: 184,
			dc1_panel_voltage_max: 45.2, // open circuit voltage
			dc1_panel_current_max: 8.76, // short circuit current
			dc1_panel_voltage_nominal: 35.8, // max power voltage (at standart testing conditions, STC)
			dc1_panel_current_nominal: 8.66, // max power current (at STC)
			dc2_panel_name: 'Perlight/Altek ALM-260P-60',
			dc2_panel_start_date: new Date('2017-04-05'), // March 27, 2016
			dc2_panel_qty: 12,
			dc2_panel_power: 260,
			dc2_panel_location: 'House roof',
			dc2_panel_tilt: 31,
			dc2_panel_azimut: 184,
			dc2_panel_voltage_max: 37.97,
			dc2_panel_current_max: 9.05,
			dc2_panel_voltage_nominal: 30.63,
			dc2_panel_current_nominal: 8.49,
			inverter_name: 'Conext RL 4000 ES',
			inverter_ac_power: 4,
			inverter_start_date: new Date(2016, 9, 8) // Octrober 8, 2016
		});
	});

}());
