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
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// TODO: read .json config instead of requiring js
var config = require('./config');
var deviceManager = require('./app/manager/device-manager');
var measurement = require('./app/model/measurement-model');
let measurementManager = require('./app/manager/measurement-manager');
let daySummaryManager = require('./app/manager/day-summary-manager');
let inverterConfigManager = require('./app/manager/inverter-configuration-manager');
let monthStatManager = require('./app/manager/month-stat-manager');
let jsonResponse = require('./app/json-response-factory');
let pubsub = require('./app/pubsub');


app.use(cors());
app.options('*', cors());


io.on('connection', function(){ console.log('Connection!!!'); });

pubsub.on('measurementRecorded', () => {
	io.emit('new measurement');
});


app.get('/api/state', function(req, res) {
	res.set({
		'Cache-control': 'no-cache, no-store, must-revalidate'
	});
	let deviceDataPromise = deviceManager.readAll();
	deviceDataPromise
		.then((data) => {
			res.json(jsonResponse.success(
				{
					data: data
				}
			));
		})
		.catch((err) => {
			res.status(503).json(jsonResponse.error(err));
		});
});

app.get('/api/day/summary/:date?', function(req, res) {
	res.set({
		'Cache-control': 'no-cache, no-store, must-revalidate'
	});

	daySummaryManager.getDay(req.params.date)
		.then((data) => {
			res.json(jsonResponse.success(data));
		})
		.catch(() => {
			res.status(503).json(jsonResponse.error('Failed to get data'));
		});
});

app.get('/api/month/:date?', function(req, res) {
	let monthStatPromise = monthStatManager.get(req.params.date);
	monthStatPromise.then((data) => {
		res.json(jsonResponse.success(data));
	});
});

app.get('/api/day/:date?', function(req, res) {
	res.set({
		'Cache-control': 'no-cache, no-store, must-revalidate'
	});

	let measurementsPromise = measurementManager.full(req.params.date)

	measurementsPromise
		.then((data) => {
			res.json(jsonResponse.success(data));
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

app.get('/api/runtime-config', function(req, res) {
	res.set({
		'Cache-control': 'cache'
	});

	let coordinates = inverterConfigManager.getCoordinates();
	res.json(jsonResponse.success({
		coordinates: coordinates
	}));
});

// serve static files from 'public' dir
app.use(express.static(__dirname + '/public'));

server.listen(config.port, function() {
	console.log('Running on port', config.port);
	console.log('Launching scheduler');
	require('./schedule')();
});
