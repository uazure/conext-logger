(function(angular){
	'use strict';

	angular.module('app.config', []).constant('appConfig', {
		backend: '/',
		startYear: 2017
	});

	angular.module('app.config').run(['$http', 'appConfig', function($http, appConfig) {
		$http.get(appConfig.backend + 'api/runtime-config').then(function(res) {
			if (res.data.success) {
				Object.assign(appConfig, res.data.payload)
			}
		});
	}]
	);
}(angular));
