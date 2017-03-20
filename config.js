module.exports = {
	port: 8000,
	db: {
		connectionString: 'postgres://solar:solar@localhost:5432/solar'
	},
	coordinates: {
		lat: 49.966327,
		lon: 36.346082
	},
	inverters: [
		{
			id: 1,
			module: 'conext-rl-module',
			name: 'Conext RL 3000E',
			inputs: [
				{name: 'dc1'},
				{name: 'dc2'}
			]
		},
		{
			id: 2,
			module: 'conext-rl-module',
			name: 'Conext RL 4000ES',
			inputs: [
				{name: 'dc1'},
				{name: 'dc2'}
			]
		}
	],
	dcMap: {
		'dc1': 0,
		'dc2': 1
	},

	verbosity: 4, // 1 - errors only, 2 - warnings, 3 - logs, 4 - debug
};
