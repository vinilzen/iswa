(function() {
	'use strict';
	angular.module('store',['mgcrea.ngStrap.datepicker'])
		.directive('store', store)
		.directive('raitng', raitng)
		.filter('productFilter', productFilter)
		.controller('StoreController', StoreController);


	function store() {
		return {
			restrict: 'E',
			templateUrl:'store.html'
		}
	}
	function raitng() {
		return {
			restrict: 'E',
			templateUrl:'raitng.html'
		}
	}

	function productFilter(){
		return function( items, query ) {
			if (Object.keys(query).length == 0 ) {
				return items;
			} else {

				var filtered = [];

				if (query.inStock != true ){
					delete query.inStock;
				}

				angular.forEach(items, function(item) {

					var approved = true;

					angular.forEach(query, function(v, k){
						if (typeof v != "object") {
							if (v != ''){
								approved = approved * (item[k] == v);//conjunction
							}
						} else { // object must contain MIN and MAX
							if (v.min && v.min != ''){
								approved = approved * (item[k] >= parseFloat(v.min));
							}
							if (v.max && v.max != '') {
								var max = parseFloat(v.max);
								if (k === 'Issue_date') {
									var issue_date_max = new Date(max);
									max = issue_date_max.setDate(issue_date_max.getDate() + 1);
								}
								approved = approved * (item[k] <= max);
							}
						}
					});

					if ( approved ) {
						filtered.push(item);
					}
				});
				return filtered;
			}
		};
	}

	function StoreController($rootScope, $scope, AppService) {

		var StoreCtrl = this;

		StoreCtrl.products = [];

		this.getProducts = AppService.getProducts;

		this.query = {

		};

		this.successGetProducts = function(data){
			StoreCtrl.products = data;
		}

		this.errorGetProducts = function(e){
			console.log(e);
		}

		this.showMessage = function(message) {
			this.message = message;
		}

		this.addToCart = function(product) {
			$rootScope.$broadcast('addToCart', { 'product': product });
		}

		AppService.subscribeAuth($scope, function isAuthorised(a) {

			StoreCtrl.showMessage(AppService.message);
			StoreCtrl.getProducts()
				.success(StoreCtrl.successGetProducts)
				.error(StoreCtrl.errorGetProducts);
		});

	}

})();