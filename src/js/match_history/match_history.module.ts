import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('MatchHistory');

import './controllers/match_history.controller.ts';
angular
  .module('MatchHistory')
  .config(['$stateProvider', function($stateProvider){
    const tplMatchHistory = <string> require('./views/match_history.html');
    $stateProvider.state('app.matchHistory', {
        url: '/match_history',
        template: tplMatchHistory,
        controller: 'MatchHistoryController',
        controllerAs: 'vm',
        resolve:{
          Matches:['$http', 'PATHS', function($http, PATHS){
            return $http.get(PATHS.api + '/match/history');
          }]
        }
    });
  }]);