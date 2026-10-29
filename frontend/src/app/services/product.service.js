(function () {
  'use strict';

  angular.module('stockpilotApp').factory('ProductService', ProductService);

  ProductService.$inject = ['$resource', '$http', 'API_BASE_URL'];
  function ProductService($resource, $http, API_BASE_URL) {
    var Product = $resource(
      API_BASE_URL + '/products/:id',
      { id: '@_id' },
      {
        update: { method: 'PUT' },
        query: { method: 'GET', isArray: false }, // response is { success, data: [...] }
      }
    );

    return {
      list: list,
      get: get,
      create: create,
      update: update,
      remove: remove,
      stats: stats,
    };

    /** Lists products with optional query params: search, category, lowStock, page, limit */
    function list(params) {
      return Product.query(params || {}).$promise;
    }

    function get(id) {
      return Product.get({ id: id }).$promise.then(function (res) {
        return res.data;
      });
    }

    function create(payload) {
      return Product.save(payload).$promise.then(function (res) {
        return res.data;
      });
    }

    function update(id, payload) {
      return Product.update({ id: id }, payload).$promise.then(function (res) {
        return res.data;
      });
    }

    function remove(id) {
      return Product.delete({ id: id }).$promise;
    }

    /** Dashboard summary stats: total products, total units, total value, low-stock count */
    function stats() {
      return $http.get(API_BASE_URL + '/products/stats/summary').then(function (response) {
        return response.data.data;
      });
    }
  }
})();
