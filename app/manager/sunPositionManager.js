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

let sunCalc = require('suncalc');
let moment = require('moment');
let coords = require('../../config').cooridnates;
let logger = require('../logger');

module.exports = {
	get: function(dateString) {
		let date = moment(dateString).toDate();
		let pos = sunCalc.getPosition(date, coords.lat, coords.lon);

		return {
			azimuth: ((pos.azimuth + Math.PI) * 180 / Math.PI) % 360,
			altitude: pos.altitude * 180 / Math.PI
		};
	}

}
