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

(function(angular){
	'use strict';
	angular.module('app', ['ui.router', 'app.config', 'ui.bootstrap', 'chart.js']);

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
