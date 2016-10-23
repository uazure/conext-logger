var ConextReader = require('./app/conext-rl-module');
var Sequelize = require('sequelize');

module.exports = function() {
	var inverter = new ConextReader(2);
	inverter.read()
		.then((data) => {
			debugger;
			console.log('got data', data);
			var sequelize = new Sequelize('postgres://solar:solar@localhost:5432/solar');
			sequelize.authenticate()
				.then(function(err) {
					console.log('Connection has been established successfully.');
					debugger;
				})
				.catch(function (err) {
					console.log('Unable to connect to the database:', err);
				});
		});
}

module.exports();
