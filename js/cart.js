(function() {
	'use strict';
	angular.module('cart',[])
		.controller('CartController', CartController);


	function CartController($scope, AppService) {
		var products = $scope.products = this.products = [];

		this.popover = function(){
			return angular.element( document.querySelector( '#popover' ) ).html();
		}

		$scope.$on('addToCart', function (event, args) {
			var product_exist = false;
			products.forEach(function (product) {
				if (args.product.id === product.id) {
					product_exist = true;
					return;
				}
			});

			if (!product_exist) {
				products.push(args.product);
			} else {
				console.log('Product alredy in cart.')
			}
		});
	}

})();