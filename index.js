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
var express = require('express');
var app = express();
var cors = require('cors');
// TODO: read .json config instead of requiring js
var config = require('./config');
var deviceManager = require('./app/device-manager');
var measurement = require('./app/measurement-model');
var measurementArrayConverter = require('./app/measurement-model-array-converter');

app.use(cors());
app.options('*', cors());

app.get('/api/state', function(req, res) {
	res.set({
		'Cache-control': 'no-cache, no-store, must-revalidate'
	});
	deviceManager.readAll().then((data) => {
		res.json({success: true, payload: data});
	})
	.catch((err) => {
		res.status(503).json({success: false, payload: err});
	});
});

app.get('/api/day/:date?', function(req, res) {
	res.set({
		'Cache-control': 'no-cache, no-store, must-revalidate'
	});
	let targetDateEnd;
	let targetDateStart;
	let requestDate = req.params.date;

	if (!requestDate) {
		targetDateEnd = new Date();
		let year = targetDateEnd.getFullYear();
		let month = targetDateEnd.getMonth();
		let day = targetDateEnd.getDate();
		targetDateStart = new Date(year, month, day);
	} else {
		let dates = requestDate.split('-');
		if (dates.length == 3) {
			let date = new Date(dates[0], dates[1]-1, dates[2]);
			targetDateStart = date;
			targetDateEnd = new Date(date.valueOf() + 24*3600*1000);
		}
	}

	measurement.findAll({
		where: {
			created_at: {
				$lt: targetDateEnd,
				$gt: targetDateStart
			}
		},
		order: [
			['created_at', 'ASC']
		]
	})
		.then((data) => {

			res.json(measurementArrayConverter(data))});
});

app.get('/api/alltime', function(req, res) {
	res.set({
		'Cache-control': 'no-cache, no-store, must-revalidate'
	});
	measurement.findAll()
		.then((data) => {res.json(data)})
		.catch((err) => {res.json({error: true, details: err})})
});

// serve static files from 'public' dir
app.use(express.static(__dirname + '/public'));

app.listen(config.port, function() {
	console.log('Running on port', config.port);
	console.log('Launching scheduler');
	require('./schedule')();
});
