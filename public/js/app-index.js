(function(angular) {
	'use strict';
	angular.module('app').component('appIndex',
		{
			templateUrl: 'partials/app-index.html',
			controller: ['$scope', '$timeout', 'currentMeasurementRepository', 'dayMeasurementRepository', function($scope, $timeout, currentMeasurementRepository, dayMeasurementRepository) {
				var vm = $scope;
				vm.date = new Date();
				vm.currentMeasurement = {};
				vm.update = function() {
					return currentMeasurementRepository.get()
						.then(function(result) {
							vm.currentMeasurement = result;
							vm.date = new Date();
						});
				}

				vm.showDetails = false;
				vm.toggleShowDetails = function() {
					vm.showDetails = !vm.showDetails;
				}

				function callUpdate() {
					vm.update().then(function() {
						$timeout(function() {callUpdate()}, 3000);
					})
				};

				callUpdate();

			}]
		});
}(angular));
