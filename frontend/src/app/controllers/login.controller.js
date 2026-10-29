(function () {
  'use strict';

  angular.module('stockpilotApp').controller('LoginController', LoginController);

  LoginController.$inject = ['$location', 'AuthService'];
  function LoginController($location, AuthService) {
    var vm = this;

    vm.credentials = { email: '', password: '' };
    vm.isSubmitting = false;
    vm.errorMessage = '';
    vm.submit = submit;

    // If already logged in, skip straight to the dashboard
    if (AuthService.isAuthenticated()) {
      $location.path('/dashboard');
    }

    function submit(loginForm) {
      if (loginForm.$invalid) {
        vm.errorMessage = 'Please enter a valid email and password.';
        return;
      }

      vm.isSubmitting = true;
      vm.errorMessage = '';

      AuthService.login(vm.credentials)
        .then(function () {
          $location.path('/dashboard');
        })
        .catch(function (err) {
          vm.errorMessage = (err.data && err.data.message) || 'Login failed. Please try again.';
        })
        .finally(function () {
          vm.isSubmitting = false;
        });
    }
  }
})();
