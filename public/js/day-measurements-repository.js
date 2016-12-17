(function(angular) {
	'use strict';
	angular.module('app').factory('dayMeasurementRepository', ['$http', '$filter', 'dayMeasurementAdapter', function($http, $filter, dayMeasurementAdapter) {
		return {
			get: function(date) {
				if (!date) {
					date = new Date();
				}

				var dateString = $filter('date')(date, 'yyyy-MM-dd');

				return $http.get('/api/day/' + dateString)
					.then(function(data) {
						return dayMeasurementAdapter.convertAll(data.data);
					});
			}
		}
	}]
	);
}(window.angular));
