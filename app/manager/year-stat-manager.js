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
let arrayConverter = require('../month-summary-array-converter');
let moment = require('moment');

module.exports = {
	get: function(year) {
		if (!year) {
			year = new Date();
		}
		let startOfYearMoment = moment(year).startOf('year');
		let endOfYearMoment = startOfYearMoment.clone().endOf('year');
		let statPromise = daySummaryModel.findAll({
			attributes: [
				// [daySummaryModel.sequelize.fn('extract', daySummaryModel.sequelize.col('date'), 'month'), 'month'],
				// [daySummaryModel.sequelize.fn('min', daySummaryModel.sequelize.col('date')), 'date'],
				[daySummaryModel.sequelize.fn('to_char', daySummaryModel.sequelize.col('date'), 'YYYY-MM'), 'month'],
				'inverter_id',
				[daySummaryModel.sequelize.fn('max', daySummaryModel.sequelize.col('total_duration')), 'total_duration'],
				[daySummaryModel.sequelize.fn('max', daySummaryModel.sequelize.col('total_energy')), 'total_energy'],
				[daySummaryModel.sequelize.fn('sum', daySummaryModel.sequelize.col('duration')), 'duration'],
				[daySummaryModel.sequelize.fn('sum', daySummaryModel.sequelize.col('energy')), 'energy']
			],
			group: ['inverter_id', 'month'],
			where: {
				date: {
					$lte: endOfYearMoment.toDate(),
					$gt: startOfYearMoment.toDate()
				}
			},
			order: ['inverter_id', 'month']
		}).then((res) => {
			// console.log('res', res);
			return arrayConverter(res);
		});

		return statPromise;
	}
};
