(function(angular){
	'use strict';
	angular.module('app', ['ui.router', 'nvd3', 'app.config', 'ui.bootstrap']);

	angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		$stateProvider.state({
			name: 'dashboard',
			url: '/',
			template: '<app-dashboard></app-dashboard>'
			// component: 'appDashboard' // this doesn't work :(
		});

		$stateProvider.state({
			name: 'dayHistory',
			url: '/day/{date}',
			template: '<app-day-history></app-day-history>'
		});



		$urlRouterProvider.otherwise('/');

	}]);

}(angular));
