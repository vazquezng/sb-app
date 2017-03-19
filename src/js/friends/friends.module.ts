import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('Friends');

import './controllers/friends.controller.ts';

angular
  .module('Friends')
  .config(['$stateProvider', function($stateProvider){
    const tplAppFriends = <string> require('./views/friends.html');
    $stateProvider.state('app.friends', {
        url: '/friends',
        template: tplAppFriends,
        controller: 'FriendsController',
        controllerAs: 'vm',
        resolve:{
          Friends:['$http', 'PATHS', function($http, PATHS){
            return $http.get(PATHS.api + '/match/friends');
          }]
        }
    })
  }]);