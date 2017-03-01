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

let config = require('../../config');
let Sequelize = require('sequelize');
let logger = require('../logger');

let sequelize = new Sequelize(config.db.connectionString, {
	logging: logger.log
});

let model = sequelize.define('inverterConfig', {
	valid_from: {type: Sequelize.DATE},
	valid_to: {type: Sequelize.DATE},
	inverter_id: {type: Sequelize.INTEGER, notNull: true},
	dc1_panel_name: {type: Sequelize.STRING},
	dc1_panel_start_date: {type: Sequelize.DATEONLY},
	dc1_panel_qty: {
		type: Sequelize.INTEGER,
		get: function() {
			return Number(this.getDataValue('dc1_panel_qty'));
		}
	},
	dc1_panel_power: {
		type: Sequelize.INTEGER,
		get: function() {
			return Number(this.getDataValue('dc1_panel_power'));
		}
	},
	dc1_panel_location: {type: Sequelize.STRING},
	dc1_panel_tilt: {type: Sequelize.INTEGER},
	dc1_panel_azimut: {type: Sequelize.INTEGER},
	dc1_panel_voltage_max: {
		type: Sequelize.DECIMAL(4,2),
		get: function() {
			return Number(this.getDataValue('dc1_panel_voltage_max'));
		}
	},
	dc1_panel_current_max: {
		type: Sequelize.DECIMAL(4,2),
		get: function() {
			return Number(this.getDataValue('dc1_panel_current_max'));
		}
	},
	dc1_panel_voltage_nominal: {
		type: Sequelize.DECIMAL(4,2),
		get: function() {
			return Number(this.getDataValue('dc1_panel_voltage_nominal'));
		}
	},
	dc1_panel_current_nominal: {
		type: Sequelize.DECIMAL(4,2),
		get: function() {
			return Number(this.getDataValue('dc1_panel_current_nominal'));
		}
	},

	dc2_panel_name: {type: Sequelize.STRING},
	dc2_panel_start_date: {type: Sequelize.DATEONLY},
	dc2_panel_qty: {
		type: Sequelize.INTEGER,
		get: function() {
			return Number(this.getDataValue('dc2_panel_qty'));
		}
	},
	dc2_panel_power: {
		type: Sequelize.INTEGER,
		get: function() {
			return Number(this.getDataValue('dc2_panel_power'));
		}
	},
	dc2_panel_location: {type: Sequelize.STRING},
	dc2_panel_tilt: {type: Sequelize.INTEGER},
	dc2_panel_azimut: {type: Sequelize.INTEGER},
	dc2_panel_voltage_max: {
		type: Sequelize.DECIMAL(4,2),
		get: function() {
			return Number(this.getDataValue('dc2_panel_voltage_max'));
		}
	},
	dc2_panel_current_max: {
		type: Sequelize.DECIMAL(4,2),
		get: function() {
			return Number(this.getDataValue('dc2_panel_current_max'));
		}
	},
	dc2_panel_voltage_nominal: {
		type: Sequelize.DECIMAL(4,2),
		get: function() {
			return Number(this.getDataValue('dc2_panel_voltage_nominal'));
		}
	},
	dc2_panel_current_nominal: {
		type: Sequelize.DECIMAL(4,2),
		get: function() {
			return Number(this.getDataValue('dc2_panel_current_nominal'));
		}
	},

	inverter_name: {type: Sequelize.STRING},
	inverter_ac_power: {
		type: Sequelize.DECIMAL(5,3),
		get: function() {
			return Number(this.getDataValue('ac_power'));
		}
	},
	inverter_start_date: {type: Sequelize.DATEONLY}
}, {
	createdAt: false,
	updatedAt: false,
	indexes: [
		{
			fields: ['inverter_id']
		},
		{
			fields: ['valid_from', 'valid_to']
		}
	]
});

module.exports = model;
