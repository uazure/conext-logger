'use strict';
var express = require('express');
var app = express();
// TODO: read .json config instead of requiring js
var config = require('./config');
// var ConextReader = require('./app/conext-rl-module');
var deviceManager = require('./app/device-manager');
var measurement = require('./app/measurement-model');

app.get('/api/state', function(req, res) {
	deviceManager.readAll().then((data) => {
		res.send(data);
	});
});

app.get('/api/day/:date?', function(req, res) {
	var targetDateEnd;
	var targetDateStart;
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
		}
	})
		.then((data) => {res.send(data)});
});

app.get('/api/alltime', function(req, res) {
	measurement.findAll()
		.then((data) => {res.send(data)});
});

// serve static files from 'public' dir
app.use(express.static('public'));

app.listen(config.port, function() {
	console.log('Running on port', config.port);
	console.log('Launching scheduler');
	require('./schedule')();
});
