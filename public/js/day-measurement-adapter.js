(function(angular) {
	'use strict';
	angular.module('app').factory('dayMeasurementAdapter', [function() {
		return {
			convertKeys: function(inverters, keys) {
				var rows = []; // rows object for nvd3 plot

				function getRowObject(inverterId, field) {
					var resultRow;
					rows.some(function(row) {
						if (row.inverterId === inverterId && row.field === field) {
							resultRow = row;
						}
					});

					if (!resultRow) {
						resultRow = {
							inverterId: inverterId,
							field: field,
							key: 'Inverter ' + inverterId + ', ' + field,
							values: []
						}
						rows.push(resultRow);
					}

					return resultRow;
				}


				inverters.forEach(function(inverter) {

					inverter.values.forEach(function(value) {
						for (var key in value) {
							if (key === 'createdAt' || keys.indexOf(key) < 0) {
								continue;
							}

							var row = getRowObject(inverter.inverterId, key);
							row.values.push([new Date(value.createdAt), value[key]]);
						}

					})
				})

				return rows;
			}
		}
	}]
	);
}(window.angular));
