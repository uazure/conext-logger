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
	angular.module('app').component('appDayHistory',
		{
			templateUrl: 'partials/app-day-history.html',
			controller: ['$scope', '$stateParams', 'dayMeasurementRepository', function($scope, $stateParams, dayMeasurementRepository) {
				var vm = $scope;
				var date;

				if ($stateParams.date) {

				} else {
					date = new Date();
				}


				vm.model = {
					startDate: date
				};

				vm.startDateOptions = {
					dateDisabled: false,
					formatYear: 'yy',
					maxDate: new Date(),
					minDate: new Date(2016, 0, 1),
					startingDay: 1,
					showWeeks: false
				};

			}]
		});
}(angular));
