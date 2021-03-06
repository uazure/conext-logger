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
	angular.module('app').component('daySummary', {
		templateUrl: 'partials/day-summary.html',
		bindings: {
			'date': '<'
		},
		controller: ['$scope', 'daySummaryRepository', function($scope, daySummaryRepository) {
			var vm = this;
			vm.summaryData = {};

			vm.isLoading = true;

			$scope.$watch('$ctrl.date', function(newValue, oldValue) {
				update();
			});

			function update() {
				vm.isLoading = true;
				vm.summaryData = {};
				daySummaryRepository.get(vm.date)
					.then(function(data) {
						vm.summaryData = data;
						vm.isLoading = false;
						vm.errorMessage = null;
					})
					.catch(function(errorMessage) {
						vm.isLoading = false;
						vm.errorMessage = errorMessage;
					});
			}
		}]
	});
}(angular));
