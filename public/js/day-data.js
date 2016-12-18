(function(angular) {
	'use strict';
	angular.module('app').component('dayData', {
		templateUrl: 'partials/day-data.html',
		controller: ['$scope', 'dayMeasurementRepository', 'dayMeasurementAdapter', function($scope, dayMeasurementRepository, dayMeasurementAdapter) {
			var vm = $scope;

			vm.config = {refreshDataOnly: false};

			vm.options = {
				chart: {
					type: 'stackedAreaChart',
					height: 450,
					margin: {
						top: 20,
						right: 20,
						bottom: 30,
						left: 40
					},
					x: function(d) {
						return d[0];
					},
					y: function(d) {
						return d[1];
					},
					useVoronoi: false,
					clipEdge: true,
					duration: 100,
					useInteractiveGuideline: true,
					xAxis: {
						showMaxMin: false,
						tickFormat: function(d) {
							return d3.time.format('%X')(new Date(d))
						}
					},
					yAxis: {
						tickFormat: function(d) {
							return d3.format(',.2f')(d);
						}
					},
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

			dayMeasurementRepository.get()
				.then(function(data) {
					vm.data = dayMeasurementAdapter.convertKeys(data, ['dc1Power', 'dc2Power']);
					var maxValues = data.map(function(series) {
						return d3.max(series.values, function(value) {return value[1];});
					})
					var max = d3.sum(maxValues, function(x) {return x;});
					vm.options.chart.yDomain = [0, Math.max(1, max)]
				});

		}]
	});
}(angular));
