'use strict';
var express = require('express');
var app = express();
// TODO: read .json config instead of requiring js
var config = require('./config.js');

app.get('/', function(req, res) {

});

// serve static files from 'public' dir
app.use(express.static('public'));

app.listen(config.port, function() {
	console.log('Running on port', config.port);
});
