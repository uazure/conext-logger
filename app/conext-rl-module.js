/** a module for Conext RL 4000 invertor.
exports constructor function

*/
var config = require('./../config');
var DataModel = require('./inverter-data-model');

var modbusMap = {
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
	constructor(id) {
		this._id = id;
		config.inverters.forEach((inverter) => {
			if (inverter.id === id) {
				this._config = inverter;
			}
		});

		if (!this._config) {
			console.error('Check config file for correct inverter configuratiion');
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
		var promise = new Promise((resolve, reject) => {
			// correct context
			this._connect()
				.then(() => this._initialize)
				.then(this._read.bind(this))
				.then(() => {
					resolve(this._state);
				});

		});
		return promise;
	}

	_read() {
		// correct context
		var promise = new Promise((resolve, reject) => {
			//correct context

			this._readValues('ac')
				.then(() => {
					return this._readValues('dc1')})
				.then(() => {
					if (this._config.inputs.length > 1) {
						return this._readValues('dc2');
					} else {
						return new Promise((resolve) => {
							resolve();
						});
					}
				})
				.then(() => {
					this._client.close();
					delete this._client;
					resolve();

				});
		});

		return promise;
	}

	_connect() {
		var promise = new Promise((resolve, reject) => {
			let ModbusRTU = require("modbus-serial");
			let modbusConfig = require('./modbus-config.js');
			let client = new ModbusRTU();
			client.setID(this._id);
			this._client = client;
			client.connectRTU(modbusConfig.serial, {baudrate: modbusConfig.baudRate}, this._setOnline.bind(this, resolve));
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

	_initialize() {
		var promise = new Promise((resolve, reject) => {
			this._client.writeRegister(modbusMap.initialize.address, modbusMap.initialize.registers)
				.then(resolve);
		});
		return promise;
	}

	_readValues(input) {
		var promise = new Promise((resolve, reject) => {
			this._switchInput(input)
				.then(() => {
					console.log('Read input', input);
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
		var readExecutor;

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
		var promise = new Promise((resolve, reject) => {
			console.log('Switch input to', input);
			var registerValue = -1;
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
		var item = modbusMap.acActual;
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
		var item = modbusMap.acDay;
		return this._client.readInputRegisters(item.address, item.registers)
			.then((data) => {
				var buf = data.buffer;
				console.log('ac day', buf.toString('hex'));
				var energy = buf.readUInt16BE(0); // Wh
				var energyMult = buf.readUInt16BE(2); // mult
				var duration = buf.readUInt16BE(4); // seconds
				//var somethingElse = buf.readUInt16BE(6); // time mult?
				this._state.ac.energy = (energy + (energyMult * 0xffff)) / 1000;
				this._state.ac.duration = duration;
			});
	}

	_readDcActual(input) {
		var inputIndex = config.dcMap[input];
		var state = this._state.dc[inputIndex];
		var item = modbusMap.dcActual;
		return this._client.readInputRegisters(item.address, item.registers)
			.then((data) => {
				var buf = data.buffer;
				console.log('dc actual value', buf.toString('hex'));
				var voltage = buf.readUInt16BE(2) / 10;
				var current = buf.readUInt16BE(4) / 100;
				var power = buf.readUInt16BE(6) / 1000;

				state.voltage = voltage;
				state.current = current;
				state.power = power;
			});
	}

	_readAcTotal() {
		var item = modbusMap.acTotal;
		return this._client.readInputRegisters(item.address, item.registers)
			.then((data) => {
				var state = this._state.ac;
				var buf = data.buffer;
				console.log('ac total', buf.toString('hex'));
				var energy = buf.readUInt16BE(0); // Wh
				var energyMult = buf.readUInt16BE(2); // energy mult
				var duration = buf.readUInt16BE(4); // seconds ???
				var mult = buf.readUInt16BE(6); // mult

				state.totalEnergy = (energy + (energyMult * 0xffff)) / 1000;
				state.totalDuration = duration + (0xffff * mult);
			});
	}

	_readAcStatus() {
		var item = modbusMap.acStatus;
		return this._client.readInputRegisters(item.address, item.registers)
			.then((data) => {
				var buf = data.buffer;
				var state = this._state.ac;

				console.log('ac status', buf.toString('hex'));
				var code = buf.readUInt16BE(0);
				switch (code) {
					case 0:
						state.online = 0;
						break;
					case 0x27:
						state.online = 1;
						break;
					default:
						console.error('Unknown status', code);
						state.online = 3;
				}
			});
	}

}




var state = {
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
var measurements = [];

// open connection to a serial port


function run() {
	client.setID(2);

	initialize()
		.then(function() {
			readValues('dc1')
				.then(function() {
					readValues('dc2')
						.then(function() {
							readValues('ac')
								.then(finish);
						})
				})
		}, function() {
			console.log('Failed to init');
			finish();
		})


}

// function readDcDay() {
// 	var item = modbusMap.dcDay;
// 	return client.readInputRegisters(item.address, item.registers)
// 		.then(function(data) {
// 			var buf = data.buffer;
// 			console.log('dc day value', buf.toString('hex'));
// 		});
// }
//
// function readDcTotal() {
// 	var item = modbusMap.acTotal;
// 	return client.readInputRegisters(item.address, item.registers)
// 		.then(function(data) {
// 			var buf = data.buffer;
// 			console.log('dc total value', buf.toString('hex'));
// 		});
// }


function readAcUnknown() {
	var item = modbusMap.acUnknown;
	return client.readInputRegisters(item.address, item.registers)
		.then(function(data) {
			var buf = data.buffer;
			console.log('ac unknown', buf.toString('hex'));
		});
}


function initialize() {
	console.log('initialize');
	return client.writeRegister(0x0321, 0)
}



function response(address, data) {
	console.log(address.toString(16) + '\t' + data.buffer.toString('hex'));
	return data;
}

function errorHandler(err) {
	console.error('Error', err);
	return err;
}


function crc16(buffer) {
	var crc = 0xFFFF;
	var odd;

	for (var i = 0; i < buffer.length; i++) {
		crc = crc ^ buffer[i];

		for (var j = 0; j < 8; j++) {
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
	var d = Math.floor(t/86400),
	h = ('0'+Math.floor(t/3600) % 24).slice(-2),
	m = ('0'+Math.floor(t/60)%60).slice(-2),
	s = ('0' + t % 60).slice(-2);
	return (d>0?d+'d ':'')+(h>0?h+':':'')+(m>0?m+':':'')+(t>60?s:s+'s');
}

function finish() {
	//console.log('Recorded state', state);
	state.acDayDurationText = sec2str(state.acDayDuration);
	console.log('state', state);
	process.exit(0);
}


module.exports = ConextReader;
