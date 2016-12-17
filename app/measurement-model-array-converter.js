'use strict';

module.exports = function(dataArray) {
	var inverters = []; // intermediate object for storing data per inverter

	function getInverterObject(record) {
		var result;

		inverters.some(function(item) {
			if (item.inverterId == record.inverter_id) {
				result = item;
				return true;
			}

			return false;
		});

		if (!result) {
			result = {
				inverterId: record.inverter_id,
				values: []
			};
			inverters.push(result);
		}

		return result;
	};

	dataArray.forEach(function(item) {
		var inverter = getInverterObject(item);
		var value = {
			createdAt: item.created_at,
			power: item.ac_power,
			dc1Power: item.dc1_power,
			dc2Power: item.dc2_power,
			voltage: item.ac_voltage,
			freq: item.ac_freq
		};

		inverter.values.push(value);
	});

	return inverters;
};
