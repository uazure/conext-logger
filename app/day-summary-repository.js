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

let daySummaryModel = require('./model/day-summary-model');
let arrayConverter = require('./day-summary-model-array-converter');
let moment = require('moment');

module.exports = {};

module.exports.getDay = function(dateString) {
	return getData(dateString).then((data) => {
		return arrayConverter(data);
	});

	function getData(dateString) {
		if (!dateString) {
			dateString = moment().format('YYYY-MM-DD');
		}


		return daySummaryModel.findAll({
			where: {
				date: dateString
			},
			order: [
				['inverter_id', 'ASC']
			]
		});
	}
};

// To be implemented
// module.exports.getRange = function(startDateString, endDateString) {
//
// }
