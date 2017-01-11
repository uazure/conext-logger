(function(angular) {
	'use strict';
	angular.module('app').component('appDashboard',
		{
			templateUrl: 'partials/app-dashboard.html',
			controller: ['$scope', '$timeout', 'currentMeasurementRepository', 'dayMeasurementRepository', function($scope, $timeout, currentMeasurementRepository, dayMeasurementRepository) {
				var vm = $scope;
				vm.date = new Date();
				vm.currentMeasurement = {};

				vm.update = function() {
					return currentMeasurementRepository.get()
						.then(function(result) {
							vm.currentMeasurement = result;
							vm.date = new Date(result[0].createdAt);
						});
				}

				vm.showDetails = false;
				vm.toggleShowDetails = function(ev) {
					vm.showDetails = !vm.showDetails;
				}

				function callUpdate() {
					vm.update().then(function() {
						$timeout(function() {callUpdate();}, 3000);
					})
					.catch(function(err) {
						console.warn('got error', err);
						$timeout(function() {callUpdate();}, 5000);
					})
				};

				callUpdate();

			}]
		});
}(angular));