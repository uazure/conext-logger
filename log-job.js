var uuid = require('node-uuid');
var config = require('./config');
var ConextReader = require('./app/conext-rl-module');
// ConextReader = require('./app/mock/conext-rl-module');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.db.connectionString);


debugger;
var Model = sequelize.define('measurement', {
	id: {type: Sequelize.UUID, primaryKey: true},
	inverter_id: {type: Sequelize.INTEGER, notNull: true},
	dc1_voltage: {type: Sequelize.DECIMAL(5,2)},
	dc1_current: {type: Sequelize.DECIMAL(4,2)},
	dc1_power: {type: Sequelize.DECIMAL(5,3)},
	dc1_energy: {type: Sequelize.DECIMAL(6,3)},
	dc2_voltage: {type: Sequelize.DECIMAL(5,2)},
	dc2_current: {type: Sequelize.DECIMAL(4,2)},
	dc2_power: {type: Sequelize.DECIMAL(5,3)},
	dc2_energy: {type: Sequelize.DECIMAL(6,3)},
	ac_voltage: {type: Sequelize.DECIMAL(5,2)},
	ac_current: {type: Sequelize.DECIMAL(4,2)},
	ac_power: {type: Sequelize.DECIMAL(5,3)},
	ac_energy: {type: Sequelize.DECIMAL(6,3)},
	ac_freq: {type: Sequelize.DECIMAL(4,2)},
	duration: {type: Sequelize.INTEGER},
	total_energy: {type: Sequelize.DECIMAL(8,3)},
	total_duration: {type: Sequelize.BIGINT}
}, {
	createdAt: 'created_at',
	updatedAt: false,
	indexes: [
		{
			fields: ['inverter_id']
		},
		{
			fields: ['created_at']
		}
	]
});


var ConextModelConverter = function(conextModel) {
	var model = {};
	model.id = uuid.v4();
	model.inverter_id = conextModel.inverterId;
	model.dc1_voltage = conextModel.dc[0].voltage;
	model.dc1_current = conextModel.dc[0].current;
	model.dc1_power = conextModel.dc[0].power;
	model.dc1_energy = conextModel.dc[0].energy;
	model.dc2_voltage = conextModel.dc[1].voltage;
	model.dc2_current = conextModel.dc[1].current;
	model.dc2_power = conextModel.dc[1].power;
	model.dc2_energy = conextModel.dc[1].energy;

	model.ac_voltage = conextModel.ac.voltage;
	model.ac_current = conextModel.ac.current;
	model.ac_power = conextModel.ac.power;
	model.ac_energy = conextModel.ac.energy;
	model.ac_freq = conextModel.ac.freq;

	model.duration = conextModel.ac.duration;
	model.total_energy = conextModel.ac.totalEnergy;
	model.total_duration = conextModel.ac.totalDuration;
	model.state = conextModel.ac.state;
	return model;
};


module.exports = function() {
	var inverter = new ConextReader(2);
	inverter.read()
		.then((data) => {
			debugger;
			console.log('got data', data);

			sequelize.authenticate()
				.then(function(err) {
					console.log('Connection has been established successfully.');

					debugger;

					// Model.sync({force: true}).then(function () {
	// Table created
					Model.create(ConextModelConverter(data))
						.then(() => {
							console.log('logged ok');
						});
					// }).then(Model.sync);

				})
				.catch(function (err) {
					console.log('Unable to connect to the database:', err);
				});
		})
		.catch(() => {
			console.warn('Failed to read data');
		});
}

if (require.main === module) {
	// called from console
	module.exports();
}
