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
