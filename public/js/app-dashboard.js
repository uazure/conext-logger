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
			controller: ['$scope', '$timeout', 'currentMeasurementRepository', 'dayMeasurementRepository', 'monthDataRepository', 'inverterConfigRepository', 'sunPositionService',
			function($scope, $timeout, currentMeasurementRepository, dayMeasurementRepository, monthDataRepository, inverterConfigRepository, sunPositionService) {
				var vm = $scope;
				var timer;
				var currentMeasurementSummary = {
					power: 0,
					energy: 0,
					monthEnergy: 0
				};

				vm.date = new Date();
				vm.isReadFailed = false;
				vm.currentMeasurement = [];
				vm.currentMeasurementSummary = currentMeasurementSummary;
				vm.monthData = [];
				vm.inverterConfig = {};
				vm.viewState = {};

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
							vm.sunPosition = sunPositionService.get();
							vm.currentMeasurement = result.data;
							vm.currentMeasurementSummary = Object.assign({}, currentMeasurementSummary);

							vm.date = new Date(vm.currentMeasurement[0].createdAt);

							/* update summary */
							vm.currentMeasurement.forEach(function (inverter) {
								vm.currentMeasurementSummary.power += inverter.ac.power;
								vm.currentMeasurementSummary.energy += inverter.ac.energy;
								if (vm.monthStat) {
									/* update summary with month stat */
									vm.currentMeasurementSummary.monthEnergy += inverter.ac.totalEnergy - vm.monthStat
								}

							});

							/* calculate power factor based on azimuth/altitude for each dc
							if inverterConfig is present */
							if (vm.inverterConfig) {
								vm.currentMeasurement.forEach(function(inverter) {



									inverter.dc.forEach(function(dc, index) {
										if (!vm.inverterConfig[inverter.inverterId]) {
											return;
										}

										var dcConfig = vm.inverterConfig[inverter.inverterId].dc[index];
										var powerFactor = sunPositionService.getPowerFactor(dcConfig, vm.sunPosition);
										Object.assign(dc, powerFactor);
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
						timer = $timeout(function() {callUpdate();}, 3000);
					})
					.catch(function(err) {
						console.warn('got error', err);
						vm.isReadFailed = true;
						timer = $timeout(function() {callUpdate();}, 5000);
					})
				};

				callUpdate();

				$scope.$on('$destroy', function() {
					$timeout.cancel(timer);
				});

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
