// Copyright (c) 2017 Sergii Popov
//
// GNU GENERAL PUBLIC LICENSE
//		Version 3, 29 June 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

'use strict';
let config = require('./config');
let logger = require('./app/logger');
let moment = require('moment');
let measurementRepository = require('./app/measurement-repository');
let daySummaryModel = require('./app/model/day-summary-model');
let daySummaryProcessor = require('./app/day-summary-processor');

// targetDate must be in format YYYY-MM-DD;
module.exports = function(targetDate) {
	let date;

	if (!targetDate) {
		date = moment().format('YYYY-MM-DD');
	} else {
		date = targetDate;
	}

	// check if data exists
	return daySummaryModel.count({where: {
		date: date
	}}).then((res) => {
		if (res > 0) {
			logger.log('There are records for date', date, 'will not recalculate');
		} else {
			return measurementRepository.full(date)
				.then((data) => {
					var models = daySummaryProcessor(date, data);
					models.forEach((model) => {
						daySummaryModel.create(model).then(() => {
							logger.log('day summary logged', model);
						}).catch((err) => {
							logger.warn('day summary failed to log', err);
						});
					});

				});
		}
	}).catch((res) => {
		logger.warn('Failed to get records from db', res);
	});

}

if (require.main === module) {
	// called from console - run with default params
	module.exports();
}
