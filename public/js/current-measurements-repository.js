(function(angular) {
	'use strict';
	angular.module('app').factory('currentMeasurementRepository', ['$http', function($http) {
		return {
			get: function() {
				return $http.get('/state');
			}
		}
	}]
	);
}(window.angular));
