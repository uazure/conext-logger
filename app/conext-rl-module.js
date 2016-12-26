'use strict';

/** a module for Conext RL 4000 invertor.
exports constructor function

*/
let config = require('./../config');
let DataModel = require('./inverter-data-model');
let logger = require('./logger');
var Promise = require('bluebird');

let modbusMap = {
	initialize: {address: 0x0321, registers: 0},
	acActual: {address: 0x041f, registers: 5},
	acDay: {address: 0xcfff, registers: 4},
	acTotal: {address: 0xd003,registers: 4},
	acStatus: {address: 0x0417, registers: 1},
	acUnknown: {address: 0xa002, registers: 6},
	dcActual: {address: 0x041f, registers: 4},
	dcDay: {address: 0xcfff, registers: 4},
	dcTotal: {address: 0xd003, registers: 4},
};

class ConextReader {
	constructor(id, modbusClient) {
		this._id = id;
		this._client = modbusClient;

		config.inverters.forEach((inverter) => {
			if (inverter.id === id) {
				this._config = inverter;
			}
		});

		if (!this._config) {
			logger.error('Check config file for correct inverter configuratiion');
			throw new Error('Failed to get configuration for inverter id', id);
		}

		this._state = new DataModel();
		this._state.inverterId = id;
		// prepare internal state to correspond to number of inputs
		while (this._state.dc.length < this._config.inputs.length) {
			this._state.dc.push(Object.assign({}, this._state.dc[0]));
		}
	}

	read() {
		this._state.createdAt = new Date();
		let promise = new Promise((resolve, reject) => {
			try {
				// correct context
				this._initialize()
					.then(this._read.bind(this))
					.then(() => {
						resolve(this._state);
					})
					.catch(() => {
						reject('Failed to read data from inverter ' + this._id);
					});
			} catch (er) {
				logger.error('Got error', er);
				reject();
			}
		});

		return promise;
	}

	_initialize() {
		this._client.setID(this._id);
		let promise = new Promise((resolve, reject) => {
			this._client.writeRegister(modbusMap.initialize.address, modbusMap.initialize.registers)
				.then(resolve)
				.catch((err) => {
					logger.warn('Failed to read reply', err);
					reject("Failed to initialize");
				});
		});
		return promise;
	}

	_read() {
		// correct context
		let promise = new Promise((resolve, reject) => {
			//correct context

			this._readValues('ac')
				.then(() => {
					return this._readValues('dc1')})
				.then(() => {
					if (this._config.inputs.length > 1) {
						return this._readValues('dc2');
					} else {
						// return new Promise((resolve) => {
						// 	resolve();
						// });
					}
				})
				.then(() => {
					resolve();
				})
				.catch(reject);
		});

		return promise;
	}



	_setOnline(resolve) {
		this._isOnline = true;
		resolve();
	}

	_setOffline() {
		this._isOnline = false;
	}

	_readValues(input) {
		let promise = new Promise((resolve, reject) => {
			this._switchInput(input)
				.then(() => {
					logger.debug('Read input', input);
					let queue = [];
					switch (input) {
						case 'dc1':
						case 'dc2':
							queue.push(this._readDcActual.bind(this, input) /*, this._readDcDay.bind(this, input)*/ /*, this._readDcTotal.bind(this, input)*/);
							break;
						case 'ac':
						default:
							queue.push(this._readAcActual.bind(this), this._readAcDay.bind(this), this._readAcTotal.bind(this), this._readAcStatus.bind(this)/*, this._readAcUnknown*/);
							break;
					}

					this._readInputSequence(queue, resolve);
				})
			});
		return promise;
	}

	_readInputSequence(queue, resolve) {
		let readExecutor;

		if (queue.length > 0) {
			readExecutor = queue[0];
			queue = queue.slice(1);
		}

		if (readExecutor) {
			readExecutor()
				.then(() => {
					this._readInputSequence(queue, resolve)
				});
		} else {
			resolve();
		}
	}

	_switchInput(input) {
		let promise = new Promise((resolve, reject) => {
			logger.debug('Switch input to', input);
			let registerValue = -1;
			switch (input) {
				case 'dc1':
				registerValue = 0x0030;
				break;
				case 'dc2':
				registerValue = 0x0031;
				break;
				case 'ac':
				default:
				registerValue = 0x0000;
				break;
			}
			this._client.writeRegister(0x031f, registerValue)
				.then(() => {
					resolve();
				});
		});

		return promise;

	}

	_readAcActual() {
		let item = modbusMap.acActual;
		return this._client.readInputRegisters(item.address, item.registers)
			.then((data) => {
				let buf = data.buffer;
				let acVoltage = buf.readUInt16BE(2) / 10;
				let acCurrent = buf.readUInt16BE(4) / 100;
				let acPower = buf.readUInt16BE(6) / 1000;
				let acFreq = buf.readUInt16BE(8) / 100;
				this._state.ac.voltage = acVoltage;
				this._state.ac.current = acCurrent;
				this._state.ac.power = acPower;
				this._state.ac.freq = acFreq;
			});
	}

	_readAcDay() {
		let item = modbusMap.acDay;
		return this._client.readInputRegisters(item.address, item.registers)
			.then((data) => {
				let buf = data.buffer;
				logger.debug('ac day', buf.toString('hex'));
				let energy = buf.readUInt16BE(0); // Wh
				let energyMult = buf.readUInt16BE(2); // mult
				let duration = buf.readUInt16BE(4); // seconds
				//let somethingElse = buf.readUInt16BE(6); // time mult?
				this._state.ac.energy = (energy + (energyMult * 0xffff)) / 1000;
				this._state.ac.duration = duration;
			});
	}

	_readDcActual(input) {
		let inputIndex = config.dcMap[input];
		let state = this._state.dc[inputIndex];
		let item = modbusMap.dcActual;
		return this._client.readInputRegisters(item.address, item.registers)
			.then((data) => {
				let buf = data.buffer;
				logger.debug('dc actual value', buf.toString('hex'));
				let voltage = buf.readUInt16BE(2) / 10;
				let current = buf.readUInt16BE(4) / 100;
				let power = buf.readUInt16BE(6) / 1000;

				state.voltage = voltage;
				state.current = current;
				state.power = power;
			});
	}

	_readAcTotal() {
		let item = modbusMap.acTotal;
		return this._client.readInputRegisters(item.address, item.registers)
			.then((data) => {
				let state = this._state.ac;
				let buf = data.buffer;
				logger.debug('ac total', buf.toString('hex'));
				let energy = buf.readUInt16BE(0); // Wh
				let energyMult = buf.readUInt16BE(2); // energy mult
				let duration = buf.readUInt16BE(4); // seconds
				let mult = buf.readUInt16BE(6); // mult

				state.totalEnergy = (energy + (energyMult * 0xffff)) / 1000;
				state.totalDuration = duration + (0xffff * mult);
			});
	}

	_readAcStatus() {
		let item = modbusMap.acStatus;
		return this._client.readInputRegisters(item.address, item.registers)
			.then((data) => {
				let buf = data.buffer;
				let state = this._state.ac;

				logger.debug('ac status', buf.toString('hex'));
				let code = buf.readUInt16BE(0);
				switch (code) {
					case 0:
						state.online = 0;
						break;
					case 0x27:
					case 0x23:
						state.online = 1;
						break;
					default:
						logger.error('Unknown status', code);
						state.online = 0;
				}
			});
	}

}


let state = {
	status: 'unknown',
	dc1Power: 0, // kW
	dc1Voltage: 0, //V
	dc1Current: 0, //A
	dc1DayEnergy: 0, //kWh
	// dc1TotalEnergy: 0, // kWh
	dc2Power: 0, // kW
	dc2Voltage: 0, //V
	dc2Current: 0, //A
	dc2DayEnergy: 0, //kWh
	// dc2TotalEnergy: 0, // kWh
	acPower: 0, // kW
	acFreq: 0, // Hz
	acVoltage: 0, //volts
	acCurrent: 0, //ampers
	acDayEnergy: 0, // kWh
	acDayDuration: 0, //seconds
	acTotalEnergy: 0, // kWh
	acTotalDuration: 0, //seconds?
};

function readAcUnknown() {
	let item = modbusMap.acUnknown;
	return client.readInputRegisters(item.address, item.registers)
		.then(function(data) {
			let buf = data.buffer;
			logger.log('ac unknown', buf.toString('hex'));
		});
}


function initialize() {
	logger.debug('initialize reader');
	return client.writeRegister(0x0321, 0)
}

function crc16(buffer) {
	let crc = 0xFFFF;
	let odd;

	for (let i = 0; i < buffer.length; i++) {
		crc = crc ^ buffer[i];

		for (let j = 0; j < 8; j++) {
			odd = crc & 0x0001;
			crc = crc >> 1;
			if (odd) {
					crc = crc ^ 0xA001;
			}
		}
	}

	return crc;
};

function sec2str(t){
	let d = Math.floor(t/86400),
	h = ('0'+Math.floor(t/3600) % 24).slice(-2),
	m = ('0'+Math.floor(t/60)%60).slice(-2),
	s = ('0' + t % 60).slice(-2);
	return (d>0?d+'d ':'')+(h>0?h+':':'')+(m>0?m+':':'')+(t>60?s:s+'s');
}


module.exports = ConextReader;
