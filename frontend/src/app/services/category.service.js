(function () {
  'use strict';

  angular.module('stockpilotApp').factory('CategoryService', CategoryService);

  CategoryService.$inject = ['$resource', 'API_BASE_URL'];
  function CategoryService($resource, API_BASE_URL) {
    var Category = $resource(
      API_BASE_URL + '/categories/:id',
      { id: '@_id' },
      {
        update: { method: 'PUT' },
        query: { method: 'GET', isArray: false },
      }
    );

    return {
      list: list,
      create: create,
      update: update,
      remove: remove,
    };

    function list() {
      return Category.query().$promise.then(function (res) {
        return res.data;
      });
    }

    function create(payload) {
      return Category.save(payload).$promise.then(function (res) {
        return res.data;
      });
    }

    function update(id, payload) {
      return Category.update({ id: id }, payload).$promise.then(function (res) {
        return res.data;
      });
    }

    function remove(id) {
      return Category.delete({ id: id }).$promise;
    }
  }
})();
