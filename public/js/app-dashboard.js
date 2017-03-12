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
	angular.module('app').component('appDashboard',
		{
			templateUrl: 'partials/app-dashboard.html',
			controller: ['$scope', '$timeout', 'currentMeasurementRepository', 'dayMeasurementRepository', 'monthDataRepository', 'inverterConfigRepository',
			function($scope, $timeout, currentMeasurementRepository, dayMeasurementRepository, monthDataRepository, inverterConfigRepository) {
				var vm = $scope;

				vm.date = new Date();
				vm.isReadFailed = false;
				vm.currentMeasurement = {};
				vm.monthData = [];
				vm.inverterConfig = {};

				vm.updateMonthSummary = function() {
					monthDataRepository.get()
						.then(function(res) {
							if (res && res.length) {
								vm.monthStat = {};
								// iterate over inverters
								res.forEach(function(inv) {
									// month start energy
									if (!inv.values.length) {
										return;
									}
									var data = vm.monthStat[inv.inverterId] = {};
									data.startEnergy = inv.values[0].totalEnergy - inv.values[0].energy;
									Object.assign(data, findMaxValues(inv.values));
								});

								//vm.monthData = res;
							}
						});
				};

				vm.updateMonthSummary();

				inverterConfigRepository.get()
					.then(function(res) {
							vm.inverterConfig = res;
							console.log('inv config', vm.inverterConfig);
					});


				vm.update = function() {
					return currentMeasurementRepository.get()
						.then(function(result) {
							vm.sunPosition = result.sunPosition;
							vm.currentMeasurement = result.data;
							vm.date = new Date(vm.currentMeasurement[0].createdAt);

							/* calculate power factor based on azimuth/altitude for each dc
							if inverterConfig is present */
							if (vm.inverterConfig) {
								vm.currentMeasurement.forEach(function(inverter) {
									inverter.dc.forEach(function(dc, index) {
										var dcConfig = vm.inverterConfig[inverter.inverterId].dc[index];
										dc.powerFactor = Math.cos((vm.sunPosition.azimuth - dcConfig.azimuth) / 180 * Math.PI)
											* Math.cos((90 - dcConfig.tilt - vm.sunPosition.altitude) / 180 * Math.PI);
									});
								})
							}
						});
				}

				vm.showDetails = false;
				vm.toggleShowDetails = function(ev) {
					vm.showDetails = !vm.showDetails;
				}

				function callUpdate() {
					return vm.update().then(function() {
						vm.isReadFailed = false;
						$timeout(function() {callUpdate();}, 3000);
					})
					.catch(function(err) {
						console.warn('got error', err);
						vm.isReadFailed = true;
						$timeout(function() {callUpdate();}, 5000);
					})
				};

				callUpdate();

			}]
		});

	function findMaxValues(values) {
		var result = {
			energyMax: 0,
			energyMaxDate: null,
			dc1EnergyMax: 0,
			dc1EnergyMaxDate: null,
			dc2EnergyMax: 0,
			dc2EnergyMaxDate: null
		};
		values.forEach(function(val) {
			if (val.energy > result.energyMax) {
				result.energyMax = val.energy;
				result.energyMaxDate = val.date;
			}
			if (val.dc1Energy > result.dc1EnergyMax) {
				result.dc1EnergyMax = val.dc1Energy;
				result.dc1EnergyMaxDate = val.date;
			}
			if (val.dc2Energy && val.dc2Energy > result.dc2EnergyMax) {
				result.dc2EnergyMax = val.dc2Energy;
				result.dc2EnergyMaxDate = val.date;
			}
		});

		return result;
	};
}(angular));
