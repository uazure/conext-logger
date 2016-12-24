'use strict';
var ModbusRTU = require("modbus-serial");
var modbusConfig = require('./modbus-config.js');
var ConextReader = require('./conext-rl-module');
var config = require('../config.js');
var logger = require('./logger');
var Promise = require('bluebird');


var prevPromiseReply = null;
var inverters = [];

var isConnected = false;
// instantiate modbusClient
var client = new ModbusRTU();
var connectedPromise = new Promise((resolve, reject) => {
	client[modbusConfig.method](
		modbusConfig.serial,
		modbusConfig.options,
		() => {
			logger.log('Connect to modbus successful');
			isConnected = true;
			resolve();
		},
		() => {throw new Error('Can not connect to modbus');});
});

// instantiate objects related to data readers (inverters)
config.inverters.forEach((inv) => {
	let inverterClass = require('./' + inv.module);
	let instance = new inverterClass(inv.id, client);
	inverters.push(instance);
})

var pendingReply;



var manager = {
	readAll: function() {
		if (pendingReply) {
			return pendingReply;
		}

		if (!isConnected) {
			logger.log('Not connected to modbus yet, will read data once connected')
			return connectedPromise.then(manager.readAll.bind(this));
		}

		pendingReply = this._readAll();
		pendingReply.then((res) => {
			pendingReply = null;
			return res;
		}, (res) => {
			logger.error('Device manager: failed to read data', res);
			pendingReply = null;
		});

		return pendingReply;
	},
	_readAll: function() {
		let reply = [];
		let promise = new Promise((resolve, reject) => {
			let prevPromise;
			let final;

			// helper function for handling reply and resolving promise if it's the last one
			let handleResult = function(res) {
				reply.push(res);
				if (reply.length === inverters.length) {
					resolve(reply);
				}
				return res;
			};

			let handleError = function(res) {
				logger.error('Error occured', res);
				reject(res);
			}

			inverters.forEach((inv, index) => {
				if (prevPromise) {
					prevPromise.then(() => {
							prevPromise = inv.read()
								.then(handleResult, handleError)
						})
				} else {
					prevPromise = inv.read()
						.then(handleResult, handleError);
				}
			});

		})


		return promise
	}
};

module.exports = manager;
