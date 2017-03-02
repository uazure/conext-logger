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

let measurement = require('../model/measurement-model');
let sequelize = require('sequelize');
let moment = require('moment');
let logger = require('../logger');

module.exports = {
	get: function(dateString) {
		let dateMoment = moment(dateString).startOf('month');
		let date = dateMoment.toDate();
		let promise = measurement.findAll({
			attributes: [
				'inverter_id',
				[sequelize.fn('max', sequelize.col('total_energy')), 'month_start_energy']
			],
			where: {
				created_at: {
					$lt: date
				}
			},
			group: 'inverter_id',
			order: 'inverter_id'
		}).then(function(res) {
			return res.map((item) => {
				return {
					inverterId: item.inverter_id,
					monthStartEnergy: Number(item.get('month_start_energy'))
				}
			});
		});

		return promise;
	}
}
