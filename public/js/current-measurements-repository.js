(function(angular) {
	'use strict';
	angular.module('app').factory('currentMeasurementRepository', ['$http', function($http) {
		return {
			get: function() {
				return $http.get('/api/state').then(function(res) {
					return res.data.payload;
				});
			}
		}
	}]
	);
}(window.angular));
