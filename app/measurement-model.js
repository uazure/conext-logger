'use strict';

let config = require('../config');
let Sequelize = require('sequelize');
let logger = require('./logger');

let sequelize = new Sequelize(config.db.connectionString, {
	logging: logger.log
});

let Measurement = sequelize.define('measurement', {
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
	total_duration: {type: Sequelize.INTEGER}
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

module.exports = Measurement;
