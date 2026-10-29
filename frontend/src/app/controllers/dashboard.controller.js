(function () {
  'use strict';

  angular.module('stockpilotApp').controller('DashboardController', DashboardController);

  DashboardController.$inject = ['ProductService', 'AuthService'];
  function DashboardController(ProductService, AuthService) {
    var vm = this;

    vm.stats = null;
    vm.lowStockItems = [];
    vm.isLoading = true;
    vm.errorMessage = '';
    vm.currentUser = AuthService.getCurrentUser();

    activate();

    function activate() {
      vm.isLoading = true;

      ProductService.stats()
        .then(function (stats) {
          vm.stats = stats;
        })
        .catch(function () {
          vm.errorMessage = 'Could not load dashboard statistics.';
        });

      ProductService.list({ lowStock: 'true', limit: 5 })
        .then(function (result) {
          vm.lowStockItems = result.data;
        })
        .catch(function () {
          vm.errorMessage = 'Could not load low-stock items.';
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }
  }
})();
