(function () {
  'use strict';

  angular.module('stockpilotApp').controller('ShellController', ShellController);

  ShellController.$inject = ['$location', '$rootScope', 'AuthService'];
  function ShellController($location, $rootScope, AuthService) {
    var vm = this;

    vm.currentUser = AuthService.getCurrentUser();
    vm.isActive = isActive;
    vm.logout = logout;
    vm.initials = initials;

    // Keep currentUser fresh across login/logout without a full page reload
    $rootScope.$on('$routeChangeSuccess', function () {
      vm.currentUser = AuthService.getCurrentUser();
    });

    function isActive(path) {
      return $location.path().indexOf(path) === 0;
    }

    function logout() {
      AuthService.logout();
      $location.path('/login');
    }

    function initials(name) {
      if (!name) return '?';
      var parts = name.trim().split(/\s+/);
      return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    }
  }
})();
