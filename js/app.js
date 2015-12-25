(function() {
	'use strict';

	angular.module('shopping',['signup', 'login', 'store', 'cart', 'ngMessages', 'angular-md5', 'LocalStorageModule', 'mgcrea.ngStrap.popover'])
		.config(function (localStorageServiceProvider) {
			localStorageServiceProvider.setPrefix('store');
		})
		.value('name', 'Store')
		.run(function($rootScope, name) {
			$rootScope.name = name;
		})
		.service('AppService', ['$http', 'localStorageService', 'md5', '$rootScope', AppService])
		.controller('AppController', ['$scope', 'AppService', AppController]);

	function AppService($http, localStorageService, md5, $rootScope) {

		this.getProducts = function() {
			return $http.get('data/products.json');
		}

		this.subscribeSignup = function($scope, callback, $parentScope) {
			var handler = $rootScope.$on('signup', callback);
			$scope.$on('$destroy', handler);
		}

		this.subscribeAuth = function($scope, callback, $parentScope) {
			var handler = $rootScope.$on('authorization', callback);
			$scope.$on('$destroy', handler);
		}

		this.authorization = function(message) {
			this.message = message;
			$rootScope.$emit('authorization');
		}

		this.signup = function() {
			$rootScope.$emit('signup');
		}
	}

	function AppController($scope, AppService) {
		this.authorized = AppService.authorized;
		this.page = 'login';
		this.authorize = function() {
			this.authorized = true;
		}
		this.gotoStore = function() {
			this.page = 'store';
		}
		this.gotoLogin = function() {
			this.page = 'login';
		}
		var AppCtrl = this;

		AppService.subscribeSignup($scope, function Signup() {
			AppCtrl.gotoLogin();
		});

		AppService.subscribeAuth($scope, function isAuthorised() {
			AppCtrl.authorize();
			AppCtrl.gotoStore();
		});
	}

})();



