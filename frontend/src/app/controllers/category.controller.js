(function () {
  'use strict';

  angular.module('stockpilotApp').controller('CategoryController', CategoryController);

  CategoryController.$inject = ['CategoryService', 'AuthService'];
  function CategoryController(CategoryService, AuthService) {
    var vm = this;

    vm.categories = [];
    vm.newCategory = { name: '', description: '' };
    vm.isLoading = true;
    vm.isSubmitting = false;
    vm.errorMessage = '';
    vm.currentUser = AuthService.getCurrentUser();
    vm.isAdmin = vm.currentUser && vm.currentUser.role === 'admin';

    vm.createCategory = createCategory;
    vm.deleteCategory = deleteCategory;

    activate();

    function activate() {
      loadCategories();
    }

    function loadCategories() {
      vm.isLoading = true;
      CategoryService.list()
        .then(function (categories) {
          vm.categories = categories;
        })
        .catch(function () {
          vm.errorMessage = 'Failed to load categories.';
        })
        .finally(function () {
          vm.isLoading = false;
        });
    }

    function createCategory(categoryForm) {
      if (categoryForm.$invalid) return;

      vm.isSubmitting = true;
      vm.errorMessage = '';

      CategoryService.create(vm.newCategory)
        .then(function () {
          vm.newCategory = { name: '', description: '' };
          categoryForm.$setPristine();
          categoryForm.$setUntouched();
          loadCategories();
        })
        .catch(function (err) {
          vm.errorMessage = (err.data && err.data.message) || 'Failed to create category.';
        })
        .finally(function () {
          vm.isSubmitting = false;
        });
    }

    function deleteCategory(category) {
      var confirmed = window.confirm('Delete category "' + category.name + '"?');
      if (!confirmed) return;

      CategoryService.remove(category._id)
        .then(function () {
          loadCategories();
        })
        .catch(function (err) {
          vm.errorMessage = (err.data && err.data.message) || 'Failed to delete category (it may still have products assigned).';
        });
    }
  }
})();
