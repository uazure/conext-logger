function ConextReaderMock() {

};

ConextReaderMock.prototype = {
	read: function() {
		let promise = new Promise(function(success, fail) {
			success({ createdAt: new Date(),
			inverterId: 2,
			ac:
			 { power: 0,
				 voltage: 0,
				 current: 0,
				 energy: 6.6,
				 freq: 0,
				 duration: 37155,
				 online: 0,
				 totalEnergy: 149.218,
				 totalDuration: 702621 },
			dc:
			 [ { power: 0, voltage: 0, current: 0, energy: null },
				 { power: 0, voltage: 0, current: 0, energy: null } ] });

		});

		return promise;
	}

}

module.exports = ConextReaderMock;
