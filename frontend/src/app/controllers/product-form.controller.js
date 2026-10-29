(function () {
  'use strict';

  angular.module('stockpilotApp').controller('ProductFormController', ProductFormController);

  ProductFormController.$inject = ['$location', '$routeParams', 'ProductService', 'CategoryService'];
  function ProductFormController($location, $routeParams, ProductService, CategoryService) {
    var vm = this;

    vm.isEditMode = !!$routeParams.id;
    vm.categories = [];
    vm.isSubmitting = false;
    vm.isLoading = vm.isEditMode;
    vm.errorMessage = '';
    vm.product = {
      name: '',
      sku: '',
      category: '',
      description: '',
      price: null,
      quantity: 0,
      reorderLevel: 10,
      supplier: '',
      warehouseLocation: '',
    };

    vm.submit = submit;
    vm.cancel = cancel;

    activate();

    function activate() {
      CategoryService.list().then(function (categories) {
        vm.categories = categories;
      });

      if (vm.isEditMode) {
        ProductService.get($routeParams.id)
          .then(function (product) {
            // Normalize populated category object down to its id for the <select>
            product.category = product.category && product.category._id ? product.category._id : product.category;
            vm.product = product;
          })
          .catch(function () {
            vm.errorMessage = 'Could not load the product to edit.';
          })
          .finally(function () {
            vm.isLoading = false;
          });
      }
    }

    function submit(productForm) {
      if (productForm.$invalid) {
        vm.errorMessage = 'Please correct the highlighted fields.';
        return;
      }

      vm.isSubmitting = true;
      vm.errorMessage = '';

      var savePromise = vm.isEditMode
        ? ProductService.update(vm.product._id, vm.product)
        : ProductService.create(vm.product);

      savePromise
        .then(function () {
          $location.path('/products');
        })
        .catch(function (err) {
          var details = err.data && err.data.details;
          vm.errorMessage = details && details.length
            ? details.map(function (d) { return d.message || d; }).join(' ')
            : (err.data && err.data.message) || 'Failed to save product.';
        })
        .finally(function () {
          vm.isSubmitting = false;
        });
    }

    function cancel() {
      $location.path('/products');
    }
  }
})();
