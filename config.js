var Sequelize = require('sequelize');

module.exports = {
	port: 8000,
	db: {
		connectionString: 'postgres://solar:solar@localhost:5432/solar'
	},
	inverters: [
		{
			id: 2,
			module: 'conext-rl-module',
			name: 'Conext RL 4000ES',
			inputs: [
				{name: 'dc1', panelVendor: 'GPPV', panelPower: 310, panelQty: 6},
				{name: 'dc2', panelVendor: 'Yabang Solar / AbiSolar', panelPower: 250, panelQty: 12}
			]
		}
	],
	dcMap: {
		'dc1': 0,
		'dc2': 1
	}
};
