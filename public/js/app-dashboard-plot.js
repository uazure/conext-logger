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
	angular.module('app').component('appDashboardPlot',
		{
			templateUrl: 'partials/app-dashboard-plot.html',
			controller: ['$scope', 'dayMeasurementRepository', 'monthDataRepository', 'yearDataRepository', 'inverterConfigRepository',
			function($scope, dayMeasurementRepository, monthDataRepository, yearDataRepository, inverterConfigRepository) {
				var MODES = ['date', 'month', 'year'];

				var vm = this;
				vm.date = new Date();
				vm.mode = MODES[0];
				vm.onModeChange = function(mode) {
					vm.mode = mode;
					if (mode === MODES[0]) {
						vm.date = new Date();
					}
				};

				vm.onMonthSelect = function(date) {
					vm.mode = 'month';
					vm.date = date;
				};

				vm.onDaySelect = function(date) {
					vm.mode = 'date';
					vm.date = date;
				};

			}]
		});
}(angular));
