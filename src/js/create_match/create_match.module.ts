import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('CreateMatch');

import './controllers/create_match.controller.ts';
angular
  .module('CreateMatch')
  .config(['$stateProvider', function($stateProvider){
    $stateProvider.state('app.createMatch', {
      cache: false,
        url: '/create-match',
        views: {
            'menuContent': {
                templateUrl: 'templates/match/create_match.html',
                controller: 'CreateMatchController',
                controllerAs: 'vm'
            }
        },
        resolve:{
          UserComplete:['$http', 'PATHS', 'LoginService', 'toaster', '$state', '$ionicLoading', '$q',
          function($http, PATHS, LoginService, toaster, $state, $ionicLoading, $q){
            const deferred = $q.defer();
            if(!LoginService.getUser().complete){
              $ionicLoading.hide();
              toaster.pop({type:'error', body:'Debe completar su perfil primero.'});
              $state.go('app.profile');
              deferred.reject(false);
            }else{
              deferred.resolve(true);
            }
            return deferred.promise;
          }],
          Canchas:['$http', 'PATHS', function($http, PATHS){
            return $http.get(`${PATHS.api}/canchas`);
          }],
        },
        authenticate: true,
    });
  }]);
