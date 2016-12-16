(function(angular) {
	'use strict';
	angular.module('app').component('appIndex',
		{
			templateUrl: 'partials/app-index.html',
			controller: ['$scope', '$timeout', 'currentMeasurementRepository', function($scope, $timeout, currentMeasurementRepository) {
				var vm = $scope;
				vm.date = new Date();
				vm.currentMeasurement = {};
				vm.update = function() {
					return currentMeasurementRepository.get()
						.then((result) => {
							vm.currentMeasurement = result.data;
							vm.date = new Date();
						});
				}

				vm.showDetails = false;
				vm.toggleShowDetails = () => {
					vm.showDetails = !vm.showDetails;
				}

				let callUpdate = () => {
					vm.update().then(() => {
						$timeout(() => {callUpdate()}, 1000);
					})
				};

				callUpdate();

			}]
		});
}(angular));
