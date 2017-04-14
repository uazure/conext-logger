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

var crontab = require('node-crontab');
var logJob = require('./log-job');
var daySummaryJob = require('./day-summary-job');

module.exports = function() {
	//save values to db every minute
	crontab.scheduleJob('* * * * *', logJob);
	// run daySummaryJob on 23:59 each day
	crontab.scheduleJob('59 23 * * *', daySummaryJob.run);
};
