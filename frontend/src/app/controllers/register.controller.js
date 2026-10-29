(function () {
  'use strict';

  angular.module('stockpilotApp').controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', 'AuthService'];
  function RegisterController($location, AuthService) {
    var vm = this;

    vm.form = { name: '', email: '', password: '', role: 'staff' };
    vm.isSubmitting = false;
    vm.errorMessage = '';
    vm.submit = submit;

    function submit(registerForm) {
      if (registerForm.$invalid) {
        vm.errorMessage = 'Please fill in all fields correctly.';
        return;
      }

      vm.isSubmitting = true;
      vm.errorMessage = '';

      AuthService.register(vm.form)
        .then(function () {
          $location.path('/dashboard');
        })
        .catch(function (err) {
          var details = err.data && err.data.details;
          vm.errorMessage = details && details.length
            ? details.map(function (d) { return d.message || d; }).join(' ')
            : (err.data && err.data.message) || 'Registration failed. Please try again.';
        })
        .finally(function () {
          vm.isSubmitting = false;
        });
    }
  }
})();
