(function () {
  'use strict';

  angular
    .module('stockpilotApp')
    /**
     * Central place to change the backend API URL.
     * In this static-file setup, override it at deploy time by editing this
     * value (or, for a fancier setup, generate this file from an env var
     * during your Docker build / CI pipeline).
     */
    .constant('API_BASE_URL', '/api')
    .config(routeConfig)
    .run(runBlock);

  routeConfig.$inject = ['$routeProvider', '$locationProvider'];
  function routeConfig($routeProvider, $locationProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'app/views/login.html',
        controller: 'LoginController',
        controllerAs: 'vm',
        publicRoute: true,
      })
      .when('/register', {
        templateUrl: 'app/views/register.html',
        controller: 'RegisterController',
        controllerAs: 'vm',
        publicRoute: true,
      })
      .when('/dashboard', {
        templateUrl: 'app/views/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm',
      })
      .when('/products', {
        templateUrl: 'app/views/product-list.html',
        controller: 'ProductListController',
        controllerAs: 'vm',
      })
      .when('/products/new', {
        templateUrl: 'app/views/product-form.html',
        controller: 'ProductFormController',
        controllerAs: 'vm',
      })
      .when('/products/:id/edit', {
        templateUrl: 'app/views/product-form.html',
        controller: 'ProductFormController',
        controllerAs: 'vm',
      })
      .when('/categories', {
        templateUrl: 'app/views/categories.html',
        controller: 'CategoryController',
        controllerAs: 'vm',
      })
      .otherwise({ redirectTo: '/dashboard' });

    // Use plain hash-based routing (#!/) - no server-side rewrite rules
    // needed, which keeps the Nginx config for this app trivially simple.
    $locationProvider.hashPrefix('!');
  }

  runBlock.$inject = ['$rootScope', '$location', 'AuthService'];
  function runBlock($rootScope, $location, AuthService) {
    // Route guard: redirect unauthenticated users to /login for any route
    // that isn't explicitly marked as public.
    $rootScope.$on('$routeChangeStart', function (event, next) {
      var isPublic = next && next.$$route && next.$$route.publicRoute;
      if (!isPublic && !AuthService.isAuthenticated()) {
        $location.path('/login');
      }
    });
  }
})();
