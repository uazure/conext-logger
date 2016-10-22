(function(angular) {
	'use strict';
	angular.module('app').component('appIndex',
		{
			templateUrl: 'partials/app-index.html',
			controller: ['$scope', function($scope) {
				var vm = $scope;
				vm.date = new Date();
			}]
		});
}(angular));
