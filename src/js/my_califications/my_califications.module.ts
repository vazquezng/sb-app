import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('MyCalifications');

import './controllers/my_califications.controller.ts';

angular
  .module('MyCalifications')
  .config(['$stateProvider', function($stateProvider){
    // const tplMyCalifications = <string> require('./views/my_califications.html');
    $stateProvider
    .state('app.myCalifications', {
        url: '/my_califications',
        views: {
            'menuContent': {
              templateUrl: './templates/my_califications/my_califications.html',
              controller: 'MyCalificationsController',
              controllerAs: 'vm'
            },
        },
        resolve:{
          Califications: ['$http', 'PATHS', function($http, PATHS) {
            return $http.get(PATHS.api + '/feedback/califications');
          }],
        },
        authenticate: true,
    });
  }]);
