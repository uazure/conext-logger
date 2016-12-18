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
					title: 'Today power production',
					controlLabels: {
						"stacked":"All",
						"expanded":"Relative yield",
					},
					controlOptions: ["Stacked","Expanded"],
					height: 450,
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
