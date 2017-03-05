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
		controller: ['$scope', 'dayMeasurementRepository', 'dayMeasurementAdapter', function($scope, dayMeasurementRepository, dayMeasurementAdapter) {
			var vm = this;

			vm.config = {refreshDataOnly: false};
			vm.isReady = false;
			vm.isLoading = false;

			vm.options = {
				chart: {
					type: 'stackedAreaChart',
					title: 'Today power production',
					controlLabels: {
						"stacked":"All",
						"expanded":"Relative yield",
					},
					controlOptions: ["Stacked","Expanded"],
					height: 600,
					margin: {
						top: 0,
						right: 75,
						bottom: 40,
						left: 10
					},
					x: function(d) {
						return d[0];
					},
					y: function(d) {
						return d[1];
					},
					useVoronoi: true,
					clipEdge: true,
					duration: 100,
					useInteractiveGuideline: true,
					xAxis: {
						showMaxMin: false,
						tickFormat: function(d) {
							return d3.time.format('%X')(new Date(d))
						},
						axisLabel: 'Time'
					},
					yAxis: {
						tickFormat: function(d) {
							return d3.format(',.1f')(d);
						},
						axisLabel: 'Power, kW'
					},
					rightAlignYAxis: true,
					zoom: {
						enabled: true,
						scaleExtent: [1, 10],
						useFixedDomain: false,
						useNiceScale: false,
						horizontalOff: false,
						verticalOff: true,
						unzoomEventType: 'dblclick.zoom'
					}
				}
			};

			vm.data = [];

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
						var meaningfulData = angular.copy(data);

						data.forEach(function(inverterData, index) {
							var isLastMeaningful = false;
							meaningfulData[index].values = inverterData.values.filter(
								function(values) {
									var isMeaningful = (values.dc1Power > 0 || values.dc2Power > 0);
									var wasLastMeaningful = isLastMeaningful;
									isLastMeaningful = isMeaningful;

									if (isMeaningful || wasLastMeaningful) {
										return true;
									}
								}
							)
						});
						vm.data = dayMeasurementAdapter.convertKeys(meaningfulData, ['dc1Power', 'dc2Power']);
						var maxValues = vm.data.map(function(series) {
							return d3.max(series.values, function(value) {return value[1];});
						})
						var max = d3.sum(maxValues, function(x) {return x;});
						vm.options.chart.yDomain = [0, Math.max(1, max)];

						vm.isLoading = false;
						vm.isReady = true;
					});
			}



		}]
	});
}(angular));
