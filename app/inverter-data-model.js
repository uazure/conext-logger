/**
returns constructor that describes inverter output for one set of measurements
*/

module.exports = function() {
	return {
		createdAt: new Date(),
		inverterId: null,
		ac: {
			power: 0,
			voltage: 0,
			current: 0,
			energy: 0,
			freq: 0,
			duration: null,
			online: false
		},
		dc: [
			{
				power: 0,
				voltage: 0,
				current: 0,
				energy: null
			}
		]
	}
}
