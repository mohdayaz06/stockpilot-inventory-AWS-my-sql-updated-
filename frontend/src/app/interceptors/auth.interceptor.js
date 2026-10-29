(function () {
  'use strict';

  angular
    .module('stockpilotApp')
    .factory('AuthInterceptor', AuthInterceptor)
    .config(configureInterceptor);

  AuthInterceptor.$inject = ['$q', '$injector'];
  function AuthInterceptor($q, $injector) {
    return {
      // Attach the JWT (if present) to every outgoing request
      request: function (config) {
        var token = window.localStorage.getItem('stockpilot_token');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },

      // If the API ever returns 401 (expired/invalid token), clear the
      // stored session and bounce the user back to the login screen.
      responseError: function (rejection) {
        if (rejection.status === 401) {
          window.localStorage.removeItem('stockpilot_token');
          window.localStorage.removeItem('stockpilot_user');
          var $location = $injector.get('$location');
          $location.path('/login');
        }
        return $q.reject(rejection);
      },
    };
  }

  configureInterceptor.$inject = ['$httpProvider'];
  function configureInterceptor($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }
})();
