"use strict";

angular
	.module( APPNAME )
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

		// $urlRouterProvider.otherwise("/options");

		if ( window.history && window.history.pushState )
			$locationProvider.html5Mode(true);

		$stateProvider
			.state('options', {
				name: 'options',
				url: '/options',
				templateUrl: '/statics/partials/views/optionsbar/options.html'
			})

			.state('about', {
				name: 'about',
				url: '/about',
				templateUrl: '/statics/partials/views/optionsbar/about.html'
			})
	}]);