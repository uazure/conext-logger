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


/*
USAGE:
Check inverterId and modbusConfig to match your setup.
Then run `node testModubs.js`

*/

'use strict';

const inverterId = 1; // this must match modbus id of your inverter
const modbusConfig = {
	// example for serial port connection
	/*
	method: 'connectRTU',
	serial: '/dev/ttyUSB0', //'COM1' for windows
	options: {
		baudRate: 9600
	}
	*/

	// example for modbus telnet, suggesting that telnet server listens on
	// 192.168.16.232:50000 like I have on 3ONE TCP/IP Converter

	method: 'connectTelnet',
	serial: '192.168.16.232',
	options: {
		port: 50000
	}

};

// require dependencies
const ModbusRTU = require("modbus-serial");
const ConextReader = require('./conext-rl-module');

// instantiate client
const client = new ModbusRTU();

// connect client using modbusConfig and execute connectedCallback on success
client[modbusConfig.method](
	modbusConfig.serial,
	modbusConfig.options,
	connectedCallback,
	(err) => {
		console.log('Failed to connect', err);
	}
);

function connectedCallback() {
	console.log('Connected, will read data');
	const inverter = new ConextReader(inverterId, client);
	inverter.read().then(res => {
		console.log('Got data', res);
	})
	.catch(err => {
		console.log('Failed to read', err);
	});
}
