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

let measurement = require('./model/measurement-model');
let measurementArrayConverter = require('./measurement-model-array-converter');
let moment = require('moment');

module.exports = {};
module.exports.brief = function(date) {
	return getData(date)
		.then((data) => {
				return measurementArrayConverter.brief(data);
			});
}

module.exports.full = function(date) {
	return getData(date)
		.then((data) => {
				return measurementArrayConverter.full(data);
			});
}

function getData(requestDate) {
	let momentEnd;
	let momentStart;

	if (!requestDate) {
		momentEnd = moment();
		momentStart = momentEnd.clone().startOf('day');
	} else {
		momentStart = moment(requestDate);
		momentEnd = momentStart.clone().endOf('day');
	}

	return measurement.findAll({
		where: {
			created_at: {
				$lt: momentEnd.toDate(),
				$gt: momentStart.toDate()
			}
		},
		order: [
			['created_at', 'ASC']
		]
	});
}
