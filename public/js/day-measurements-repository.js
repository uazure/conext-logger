(function(angular) {
	'use strict';
	angular.module('app').factory('dayMeasurementRepository', ['$http', '$filter', 'appConfig', function($http, $filter, appConfig) {
		return {
			get: function(date) {
				if (!date) {
					date = new Date();
				}

				var dateString = $filter('date')(date, 'yyyy-MM-dd');

				return $http.get(appConfig.backend + 'api/day/' + dateString)
					.then(function(data) {
						return data.data;
					});
			}
		}
	}]
	);
}(window.angular));
