(function(angular) {
	'use strict';
	angular.module('app').factory('dayMeasurementRepository', ['$http', '$filter', function($http, $filter) {
		return {
			get: function(date) {
				if (!date) {
					date = new Date();
				}

				var dateString = $filter('date')(date, 'yyyy-MM-dd');

				return $http.get('/api/day/' + dateString);
			}
		}
	}]
	);
}(window.angular));
