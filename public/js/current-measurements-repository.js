(function(angular) {
	'use strict';
	angular.module('app').factory('currentMeasurementRepository', ['$http', 'appConfig', function($http, appConfig) {
		return {
			get: function() {
				return $http.get(appConfig.backend + 'api/state').then(function(res) {
					return res.data.payload;
				});
			}
		}
	}]
	);
}(window.angular));
