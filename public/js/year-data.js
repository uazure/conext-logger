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
	angular.module('app').component('yearData', {
		templateUrl: 'partials/month-data.html',
		bindings: {
			'date': '<',
			'onSelect': '&'
		},
		controller: ['$scope', 'yearDataRepository', function($scope, yearDataRepository) {
			var vm = this;

			vm.isReady = false;
			vm.isLoading = false;

			vm.series = [];
			vm.data = [];
			vm.labels = [];
			vm.onClick = function(ev) {
				// console.log("Clicked", ev[0]._model.label);
				vm.onSelect({date: ev[0]._model.label});
			};
			vm.options = {
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							unit: 'month',
							displayFormats: {
								month: 'MMM'
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
				if (newValue != oldValue) {
					update();
				}
			});

			function update() {
				if (vm.isLoading) {
					return;
				}
				vm.isLoading = true;
				yearDataRepository.get(vm.date)
					.then(function(repositoryData) {
						var currentMonth = vm.date ? new Date(vm.date) : new Date();
						var data = repositoryData;
						var labels = [];
						var seriesOptions = {
							borderWidth: 0.5,
							borderColor: '#000'
						};

						var colors = ['#FFD700', /*'#FF8C00',*/ '#4169E1', '#000080'];

						vm.options.title.text = currentMonth.toLocaleDateString(navigator.language, {year: 'numeric'});
						vm.series = data.map(function(series) {
							return series.inverterId;
						});

						vm.labels = [];
						vm.data = [];
						data.forEach(function(inverterData) {
							inverterData.values.forEach(function(record) {
								if (labels.indexOf(record.date) < 0) {
									labels.push(record.date);
								}
							});
						});

						labels.sort();

						data.forEach(function(inverterData) {
							var seriesData = [];
							labels.forEach(function(label, index) {
								// find appropriate value for series and push to vm.data
								var val = inverterData.values.find(function(record) {
									if (record.date === label) {
										return record;
									}
								});
								seriesData.push(val);
							});

							vm.datasetOverride = seriesData.map(function(series, index) {
								var seriesData;
								if (colors[index]) {
									seriesData = Object.assign({}, seriesOptions, {backgroundColor: colors[index]});
								} else {
									seriesData = seriesOptions;
								}

								return seriesData;
							});

							vm.labels = labels.map(function(label) {
								var date = new Date(label);
								return date;
							});

							vm.data.push(seriesData.map(function(record) {
								if (!record) {
									return 0;
								}

								return record.energy;
							}));

						});



						vm.isLoading = false;
						vm.isReady = true;
					});
			}



		}]
	});
}(angular));
