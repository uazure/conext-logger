(function(angular) {
	'use strict';
	angular.module('app').factory('dayMeasurementAdapter', [function() {
		return {
			convertAll: function(dataArray) {
				var data = [];

				function getKeyObject(record) {
					var result;

					data.some(function(item) {
						if (item.inverterId == record.inverter_id) {
							result = item;
							return true;
						}

						return false;
					});

					if (!result) {
						result = {
							key: "Inverter " + record.inverter_id,
							inverterId: record.inverter_id,
							values: []
						};
						data.push(result);
					}

					return result;
				};


				dataArray.forEach(function(item) {
					var key = getKeyObject(item);
					key.values.push({
						createdAt: item.created_at,
						power: item.ac_power,
						dc1Power: item.dc1_power,
						dc2Power: item.dc2_power
					})
				});

				return data;
			}
		}
	}]
	);
}(window.angular));
