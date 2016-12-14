module.exports = {
	method: 'connectTelnet',
	serial: '192.168.16.232',
	options: {
		port: 50000
	}
	// connectTCP for modbus-tcp 

	// for serial port:
	// method: 'connectRTU'
	// serial: '/dev/ttyUSB0', //'COM1' for windows
	// options: {
	// 	baudRate: 9600
	// }
}
