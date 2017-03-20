(function(angular){
	'use strict';

	angular.module('app.config', []).constant('appConfig', {
		backend: '/'
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
