import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('Login');

import './controllers/login.controller.ts';
import './services/login.service.ts';
angular
  .module('Login')
  .config(['$stateProvider', function($stateProvider){
    //const tplAppLogin = <string> require('./views/login.html');
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
    })
    /*$stateProvider.state('auth-twitter', {
        url: '/auth/twitter?token&id&newuser',
        controller: 'AuthTwitterController',
        controllerAs: 'vm',
        resolve:{
          User: ['$http', '$stateParams', 'PATHS', function($http, $stateParams, PATHS){
            return $http.get(PATHS.api + '/user/' + $stateParams.id);
          }]
        }
    })*/;
  }]);