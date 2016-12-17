(function(angular) {
	'use strict';
	angular.module('app').component('dayData', {
		templateUrl: 'partials/day-data.html',
		controller: ['$scope', '$timeout', 'dayMeasurementRepository', function($scope, $timeout, dayMeasurementRepository) {
			var vm = $scope;

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
							return d3.time.format('%x')(new Date(d))
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

			dayMeasurementRepository.get().then(function(data) {
				vm.data = data;
			});
		}]
	});
}(angular));
