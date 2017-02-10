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

let config = require('../config');
let Sequelize = require('sequelize');
let logger = require('./logger');

let sequelize = new Sequelize(config.db.connectionString, {
	logging: logger.log
});

let DaySummary = sequelize.define('daySummary', {
	id: {type: Sequelize.UUID, primaryKey: true},
	date: {
		type: Sequelize.DATEONLY,
		notNull: true
	},
	inverter_id: {
		type: Sequelize.INTEGER,
		notNull: true
	},
	dc1_power_max: {
		type: Sequelize.DECIMAL(5,3),
		get: function() {
			return Number(this.getDataValue('dc1_power_max'));
		}
	},
	dc1_energy: {
		type: Sequelize.DECIMAL(6,3),
		get: function() {
			return Number(this.getDataValue('dc1_energy'));
		}
	},
	dc2_power_max: {
		type: Sequelize.DECIMAL(5,3),
		get: function() {
			return Number(this.getDataValue('dc2_power_max'));
		}
	},
	dc2_energy: {
		type: Sequelize.DECIMAL(6,3),
		get: function() {
			return Number(this.getDataValue('dc2_energy'));
		}
	},
	duration: {type: Sequelize.INTEGER},
	energy: {
		type: Sequelize.DECIMAL(6,3),
		get: function() {
			return Number(this.getDataValue('energy'));
		}
	},
	power_max: {
		type: Sequelize.DECIMAL(5,3),
		get: function() {
			return Number(this.getDataValue('power_max'));
		}
	},
	total_energy: {
		type: Sequelize.DECIMAL(10,3),
		get: function() {
			return Number(this.getDataValue('total_energy'));
		}
	},
	total_duration: {type: Sequelize.INTEGER}
}, {
	createdAt: false,
	updatedAt: false,
	indexes: [
		{
			fields: ['inverter_id']
		},
		{
			fields: ['date']
		}
	]
});

module.exports = DaySummary;
