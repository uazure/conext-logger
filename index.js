'use strict';
var express = require('express');
var app = express();
// TODO: read .json config instead of requiring js
var config = require('./config');
var ConextReader = require('./app/conext-rl-module');


app.get('/state', function(req, res) {
	var inverter = new ConextReader(2);
	inverter.read()
		.then((data) => {
			res.send(data);
		});

});

// serve static files from 'public' dir
app.use(express.static('public'));

app.listen(config.port, function() {
	console.log('Running on port', config.port);
});
