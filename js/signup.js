(function() {
	'use strict';
	angular.module('signup',[])
		.directive('signupForm', signupForm)
		.directive('equals', equals)
		.controller('SignupController', SignupController);;


	function equals() {
		return {
			restrict: 'A', // only activate on element attribute
			require: '?ngModel', // get a hold of NgModelController
			link: function(scope, elem, attrs, ngModel) {
				if(!ngModel) return; // do nothing if no ng-model

				// watch own value and re-validate on change
				scope.$watch(attrs.ngModel, validate);

				// observe the other value and re-validate on change
				attrs.$observe('equals', validate);

				function validate() {
					// values
					var val1 = ngModel.$viewValue;
					var val2 = attrs.equals;

					// set validity
					ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
				};
			}
		}
	}

	function signupForm() {
		return {
			restrict: 'E',
			templateUrl:'signup-form.html'
		}
	}

	function SignupController(localStorageService, md5, AppService) {

		this.signup = signup;

		function signup() {
			var password = this.password,
				email = this.email;
			
			localStorageService.remove(email);
			if (localStorageService.set(email, md5.createHash(password))){
				AppService.signup();
			}
			
		}
	}

})();