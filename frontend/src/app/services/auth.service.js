(function () {
  'use strict';

  angular.module('stockpilotApp').factory('AuthService', AuthService);

  AuthService.$inject = ['$http', 'API_BASE_URL'];
  function AuthService($http, API_BASE_URL) {
    var TOKEN_KEY = 'stockpilot_token';
    var USER_KEY = 'stockpilot_user';

    return {
      register: register,
      login: login,
      logout: logout,
      isAuthenticated: isAuthenticated,
      getCurrentUser: getCurrentUser,
      fetchProfile: fetchProfile,
    };

    /** Registers a new account, then stores the returned token + user. */
    function register(payload) {
      return $http.post(API_BASE_URL + '/auth/register', payload).then(function (response) {
        persistSession(response.data.data);
        return response.data.data;
      });
    }

    /** Logs in with email/password, then stores the returned token + user. */
    function login(credentials) {
      return $http.post(API_BASE_URL + '/auth/login', credentials).then(function (response) {
        persistSession(response.data.data);
        return response.data.data;
      });
    }

    /** Clears the locally stored session. */
    function logout() {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }

    /** True if a JWT is currently stored (does not verify expiry client-side). */
    function isAuthenticated() {
      return !!window.localStorage.getItem(TOKEN_KEY);
    }

    /** Returns the cached user object (name/email/role) from local storage. */
    function getCurrentUser() {
      var raw = window.localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    }

    /** Re-fetches the current user's profile from the API (/auth/me). */
    function fetchProfile() {
      return $http.get(API_BASE_URL + '/auth/me').then(function (response) {
        return response.data.data;
      });
    }

    function persistSession(data) {
      window.localStorage.setItem(TOKEN_KEY, data.token);
      window.localStorage.setItem(
        USER_KEY,
        JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role })
      );
    }
  }
})();
