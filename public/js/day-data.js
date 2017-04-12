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
	angular.module('app').component('dayData', {
		templateUrl: 'partials/day-data.html',
		bindings: {
			'date': '<'
		},
		controller: ['$scope', 'dayMeasurementRepository', 'dayMeasurementAdapter', 'socketService', function($scope, dayMeasurementRepository, dayMeasurementAdapter, socketService) {
			var vm = this;
			var seriesOptions = {
				pointRadius: 0,
				pointHitRadius: 5,
				pointHoverRadius: 4,
				lineTension: 0,
				borderWidth: 0.5,
				borderColor: '#000'
			};
			var colors = ['#FFD700', '#FF8C00', '#4169E1', '#000080'];

			socketService.on('new measurement', function() {
				var currentDate = new Date();
				var vmDate = new Date(vm.date);
				// set to day start
				currentDate.setHours(0);
				vmDate.setHours(0);
				currentDate.setMinutes(0);
				vmDate.setMinutes(0);
				currentDate.setSeconds(0);
				vmDate.setSeconds(0);
				currentDate.setMilliseconds(0);
				vmDate.setMilliseconds(0);

				console.log('vmDate', vmDate, 'currentDate', currentDate, 'equal?', vmDate == currentDate);

				if (vmDate.valueOf() === currentDate.valueOf()) {
					update();
				}

			});

			vm.isReady = false;
			vm.isLoading = false;

			vm.series = [];
			vm.data = [];
			vm.options = {
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							unit: 'hour',
							displayFormats: {
								hour: 'HH'
							}
						},
						position: 'bottom'
					}],
					yAxes: [{
						stacked: true
					}]
				},
				legend: {
					display: true
				},
				title: {
					display: true
				}
			};

			update();

			$scope.$watch('$ctrl.date', function(newValue, oldValue) {
				update();
			});

			function update() {
				if (vm.isLoading) {
					return;
				}
				vm.isLoading = true;
				dayMeasurementRepository.get(vm.date)
					.then(function(repositoryData) {
						var data = repositoryData;
						var dataSet = [];
						var meaningfulData = angular.copy(data);

						vm.options.title.text = (vm.date || new Date()).toDateString();
						console.log('data', data);

						// filter data
						// step 1 - find inverter with larger amount of values

						data.forEach(function(inverterData, index) {
							if (inverterData.values.length > dataSet.length) {
								dataSet = inverterData.values;
							}
						});
						// iterate thru longest dataSet and leave just meaningful data
						// (which is meaningful for at least one inverter)
						var isLastMeaningful = false;
						dataSet = dataSet.filter(function(measurement) {
							var wasLastMeaningful = isLastMeaningful;
							var hasMeaningfulData = false;
							data.some(function(inverterData, index) {
								console.log('scanning inverter', inverterData.inverterId, 'for measurement', measurement.createdAt);
								hasMeaningfulData = inverterData.values.some(function(val) {
									if (inverterData.inverterId == 2) {
										console.log('inv 2');
									}
									if (val.createdAt == measurement.createdAt) {
										console.log(val.power);
										return val.power > 0;
										return true;
									}
								});
								if (!hasMeaningfulData) {

									console.log('has meaningful', hasMeaningfulData, measurement);
								}


								return hasMeaningfulData;
							});

							isLastMeaningful = hasMeaningfulData;
							return hasMeaningfulData || wasLastMeaningful;
						});

						console.log('dataSet is now', dataSet);



						data.forEach(function(inverterData, index) {
							var isLastMeaningful = false;
							meaningfulData[index].values = inverterData.values.filter(
								function(values) {
									var isMeaningful = (values.dc1Power > 0 || values.dc2Power > 0);
									var wasLastMeaningful = isLastMeaningful;
									var isOtherIvertersMeaningful = data.some(function(invData) {
										if (invData && invData.values && invData.values.some(function(measurement) {
											if (measurement.createdAt == values.createdAt && (measurement.dc1Power || measurement.dc2Power)) {
												return true;
											}
										})) {
											return true;
										}
									})
									isLastMeaningful = isMeaningful;
									console.log('isMeaningful', isMeaningful, 'isOtherIvertersMeaningful', isOtherIvertersMeaningful);
									if (isMeaningful || isOtherIvertersMeaningful || wasLastMeaningful) {
										return true;
									}
								}
							)
						});
						console.log('meaningfulData', meaningfulData);

						data = dayMeasurementAdapter.convertKeys(meaningfulData, ['dc1Power', 'dc2Power']);

						vm.series = data.map(function(series) {
							return series.key;
						});

						vm.data = data.map(function(series) {
							return series.values;
						});

						vm.datasetOverride = data.map(function(series, index) {
							var seriesData;
							if (colors[index]) {
								seriesData = Object.assign({}, seriesOptions, {backgroundColor: colors[index]});
							} else {
								seriesData = seriesOptions;
							}

							return seriesData;
						});

						vm.isLoading = false;
						vm.isReady = true;
					});
			}



		}]
	});
}(angular));
