(function() {
	'use strict';
	angular.module('login', [])
		.directive('loginForm', loginForm)
		.controller('LoginController', LoginController);


	function loginForm() {
		return {
			restrict: 'E',
			templateUrl:'login-form.html'
		}
	}

	function LoginController($scope, localStorageService, md5, AppService) {
		this.login = login;
		this.message = '';

		function login() {
			var password = this.password,
				email = this.email;

			if (localStorageService.get(email) === md5.createHash(password)) {
				AppService.authorization('You have successfully logged');
			} else {
				this.message = 'You have entered an invalid username or password';
			}

			// AppService.login(email, password);
		}
	}
})();