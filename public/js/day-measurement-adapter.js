// Copyright (c) 2017 Sergii Popov
//
// GNU GENERAL PUBLIC LICENSE
//    Version 3, 29 June 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
							row.values.push({x: new Date(value.createdAt), y: value[key]});
						}

					})
				})

				return rows;
			}
		}
	}]
	);
}(window.angular));
