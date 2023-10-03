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

let daySummaryModel = require('../model/day-summary-model');
let arrayConverter = require('../day-summary-model-array-converter');
let moment = require('moment');
const { Op } = require('sequelize');

module.exports = {
	get: function(dateString) {
		let startOfMonthMoment = moment(dateString).startOf('month');
		let endOfMonthMoment = startOfMonthMoment.clone().endOf('month');
		let statPromise = daySummaryModel.findAll({
			where: {
				date: {
					[Op.gt]: startOfMonthMoment.toDate(),
					[Op.lte]: endOfMonthMoment.toDate()
				}
			},
			order: ['inverter_id', 'date']
		}).then((res) => {
			return arrayConverter(res);
		});

		return statPromise;
	}
}
