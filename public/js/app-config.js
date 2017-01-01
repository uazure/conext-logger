(function(angular){
	'use strict';

	// uncomment this in prod
	// angular.module('app.config', []).constant('appConfig', {
	// 	backend: 'http://192.168.16.216:8000/'
	// });

	//comment this out to use dev config
	//
	angular.module('app.config', []).constant('appConfig', {
		backend: '/'
	});

}(angular));
