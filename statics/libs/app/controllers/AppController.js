angular
	.module( APPNAME )
	.controller('AppController', ['$rootScope', '$scope', function($rootScope, $scope)
	{
		$rootScope.open = false;
		$rootScope.openSide = 'options';
		$rootScope.options = {};
		$rootScope.options.themes = [
			{
				name:"Original",
				colors:["#563b8a","#a5468f","#f17e93","#eb3549"]
			},
			{
				name:"Floral",
				colors:["#DD577A","#FFF0CF","#FE5A27","#49AEC0"]
			},
			{
				name:"The Coasters",
				colors:["#FA9F29","#15CAB1","#0A633D","#2F3030"]
			}
		];
		$rootScope.options.theme = $rootScope.options.themes[0];

		$scope.saveToClipboard = function( text )
		{
			window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
		}
	}]);