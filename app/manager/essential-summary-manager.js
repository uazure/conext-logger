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
// along with this program.	If not, see <http://www.gnu.org/licenses/>.

/**
Export function that accepts date string as parameter (in format YYYY-MM-DD)
and returns promise which is resolved with array of inverters data
*/

'use strict';

let daySummaryModel = require('../model/day-summary-model');
let arrayConverter = require('../array-converter');
let measurementManager = require('./measurement-manager');
let daySummaryProcessor = require('../day-summary-processor');
let moment = require('moment');

module.exports = {};

/* manager that returns essential history data for given day.
It includes:
- total yield for start of this month
- yield for previous day
- yield for previous month
- total yield for start of a day that was 30 days ago
*/
module.exports.getDay = function(dateString) {
	let today = moment(dateString).startOf('day');
	let monthStart = today.clone().startOf('month');
	let monthAgo = today.clone().subtract(30, 'days');
	let yesterday = today.clone().subtract(1, 'days');

	let monthStartYield = measurementManager.dateStartTotalYield(monthStart)
	let monthAgoYield = measurementManager.dateStartTotalYield(monthAgo)
	monthStartYield.then((v) => {
		let ar = arrayConverter(v);
		console.log(ar);
	});
	monthAgoYield.then((v) => {
		let ar = arrayConverter(v);
		console.log(ar);
	});
};

module.exports.getDay('2017-04-02');
