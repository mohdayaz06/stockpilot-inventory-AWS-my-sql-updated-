(function () {
  'use strict';

  angular.module('stockpilotApp').controller('ProductListController', ProductListController);

  ProductListController.$inject = ['ProductService', 'CategoryService', 'AuthService'];
  function ProductListController(ProductService, CategoryService, AuthService) {
    var vm = this;

    vm.products = [];
    vm.categories = [];
    vm.filters = { search: '', category: '', lowStock: false, page: 1, limit: 10 };
    vm.pagination = { total: 0, pages: 0 };
    vm.isLoading = true;
    vm.errorMessage = '';
    vm.currentUser = AuthService.getCurrentUser();
    vm.isAdmin = vm.currentUser && vm.currentUser.role === 'admin';

    vm.search = search;
    vm.goToPage = goToPage;
    vm.confirmDelete = confirmDelete;
    vm.clearFilters = clearFilters;

    activate();

    function activate() {
      CategoryService.list().then(function (categories) {
        vm.categories = categories;
      });
      loadProducts();
    }

    function loadProducts() {
      vm.isLoading = true;
      vm.errorMessage = '';

      var params = {
        page: vm.filters.page,
        limit: vm.filters.limit,
      };
      if (vm.filters.search) params.search = vm.filters.search;
      if (vm.filters.category) params.category = vm.filters.category;
      if (vm.filters.lowStock) params.lowStock = 'true';

      ProductService.list(params)
        .then(function (result) {
          vm.products = result.data;
          vm.pagination = { total: result.total, pages: result.pages, page: result.page };
        })
        .catch(function (err) {
          vm.errorMessage = (err.data && err.data.message) || 'Failed to load products.';
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function search() {
      vm.filters.page = 1;
      loadProducts();
    }

    function clearFilters() {
      vm.filters = { search: '', category: '', lowStock: false, page: 1, limit: 10 };
      loadProducts();
    }

    function goToPage(page) {
      if (page < 1 || page > vm.pagination.pages) return;
      vm.filters.page = page;
      loadProducts();
    }

    function confirmDelete(product) {
      var confirmed = window.confirm('Delete "' + product.name + '"? This cannot be undone.');
      if (!confirmed) return;

      ProductService.remove(product._id)
        .then(function () {
          loadProducts();
        })
        .catch(function (err) {
          vm.errorMessage = (err.data && err.data.message) || 'Failed to delete product.';
        });
    }
  }
})();
