let ConextReader = require('./conext-rl-module');
let config = require('../config.js');


let prevPromiseReply = null;
let inverters = [];
debugger;

// instantiate objects related to data readers (inverters)
config.inverters.forEach((inv) => {
	let inverterClass = require('./' + inv.module);
	let instance = new inverterClass(inv.id);
	inverters.push(instance);
})

let manager = {
	readAll: () => {
		debugger;
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
				console.err('Error occured', res);
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
