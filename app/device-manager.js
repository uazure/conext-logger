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
var connectedPromise;

// instantiate objects related to data readers (inverters)
config.inverters.forEach((inv) => {
	let inverterClass = require('./' + inv.module);
	let instance = new inverterClass(inv.id, client);
	inverters.push(instance);
})

var pendingReply;
var failedReads = 0;



var manager = {
	connect: function() {
		connectedPromise = new Promise((resolve, reject) => {
			client[modbusConfig.method](
				modbusConfig.serial,
				modbusConfig.options,
				() => {
					logger.log('Connect to modbus successful');
					isConnected = true;
					resolve();
				},
				() => {
					reject();
				});
		});
	},

	reconnect: function() {
		isConnected = false;
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve('Reconnected in 1 sec');
			}, 1000);
		})

	},

	connectAndReadAll: function() {
		this.connect();
		return connectedPromise.catch((err) => {
			logger.warn('Failed to connect to device', err);
			return err;
		})
		.then(() => {
			return this._readAllExecutor();
		})

	},

	/* public method to reply on request. Handles parallel requests by sharing pendingReply
		rejects on timeout (10 sec)
		if not connected then will try to reconnect once;
	*/
	readAll: function() {
		if (pendingReply) {
			return pendingReply;
		}

		if (!isConnected) {
			logger.log('Not connected to modbus yet, will read data once connected')
			return this.connectAndReadAll();
		}

		pendingReply = this._readAllExecutor();
		pendingReply.then((res) => {
			failedReads = 0;
			pendingReply = null;
			return res;
		});

		return pendingReply;
	},

	/**
	private method for executing readAll operation.
	called
	*/
	_readAllExecutor: function() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				reject('Timed out');
				pendingReply = null;
				failedReads = 0;
			}, 5000);

			this._readAll().then(
				(res) => {
					resolve(res);
				},
				(res) => {
					++failedReads;
					logger.warn('Device manager:', res);
					if (failedReads >= 3) {
						logger.warn('Failed to read more than', failedReads, 'times');
						pendingReply = null;
						failedReads = 0;
						reject('Failed to read');
					} else {
						logger.log('Trying to reconnect, attempt', failedReads);
						this.reconnect().then(() => {
							this.connectAndReadAll()
								.then((res) => {
									resolve(res)
								});
						});
					}

				});
		});
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
