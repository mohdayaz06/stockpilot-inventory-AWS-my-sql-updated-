/**
 * Root module for the StockPilot AngularJS application.
 * Depends on ngRoute for client-side routing and ngResource for the
 * $resource-based API service wrappers.
 */
(function () {
  'use strict';

  angular.module('stockpilotApp', ['ngRoute', 'ngResource']);
})();
