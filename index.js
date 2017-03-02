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
var deviceManager = require('./app/manager/device-manager');
var measurement = require('./app/model/measurement-model');
let measurementRepository = require('./app/measurement-repository');
let daySummaryRepository = require('./app/day-summary-repository');
let inverterConfigManager = require('./app/manager/inverter-configuration-manager');
let monthStatManager = require('./app/manager/month-stat-manager');
let jsonResponse = require('./app/json-response-factory');

app.use(cors());
app.options('*', cors());

app.get('/api/state', function(req, res) {
	res.set({
		'Cache-control': 'no-cache, no-store, must-revalidate'
	});
	let deviceDataPromise = deviceManager.readAll();
	deviceDataPromise
		.then((data) => {
			res.json(jsonResponse.success(data));
		})
		.catch((err) => {
			res.status(503).json(jsonResponse.error(err));
		});
});

app.get('/api/day/summary/:date?', function(req, res) {
	res.set({
		'Cache-control': 'no-cache, no-store, must-revalidate'
	});

	daySummaryRepository.getDay(req.params.date)
		.then((data) => {
			res.json(jsonResponse.success(data));
		})
		.catch(() => {
			res.status(503).json(jsonResponse.error('Failed to get data'));
		});
});

app.get('/api/day/:date?', function(req, res) {
	res.set({
		'Cache-control': 'no-cache, no-store, must-revalidate'
	});

	let measurementsPromise = measurementRepository.brief(req.params.date)
	let monthStatPromise = monthStatManager.get(req.params.date);

	Promise.all([measurementsPromise, monthStatPromise])
		.then((data) => {
			res.json(jsonResponse.success({
				measurements: data[0],
				monthStat: data[1]
			}));
		})
		.catch(() => {
			res.status(503).json(jsonResponse.error('Failed to get data'));
		});
});

app.get('/api/inverter-config/:date?', function(req, res) {
	res.set({
		'Cache-control': 'cache'
	});

	inverterConfigManager.getInverterConfig(req.params.date)
		.then((data) => {
			res.json(jsonResponse.success(data));
		})
		.catch(() => {
			res.status(503).json(jsonResponse.error('Failed to get data'));
		});
});

// serve static files from 'public' dir
app.use(express.static(__dirname + '/public'));

app.listen(config.port, function() {
	console.log('Running on port', config.port);
	console.log('Launching scheduler');
	require('./schedule')();
});
