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

		$urlRouterProvider.otherwise('/');

	}]);

}(angular));
