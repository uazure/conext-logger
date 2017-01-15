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
let daySummaryModel = require('./app/day-summary-model');
let daySummaryProcessor = require('./app/day-summary-processor');

// targetDate must be in format YYYY-MM-DD;
module.exports = function(targetDate) {
	let date;

	if (!targetDate) {
		date = moment().format('YYYY-MM-DD');
	} else {
		date = targetDate;
	}

	measurementRepository.full(targetDate)
		.then((data) => {
			var models = daySummaryProcessor(targetDate, data);

		});
}

if (require.main === module) {
	// called from console
	module.exports('2017-01-15');
}
