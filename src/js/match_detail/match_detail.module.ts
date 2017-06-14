import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('MatchDetail');

import './controllers/match_detail.controller.ts';
angular
  .module('MatchDetail')
  .config(['$stateProvider', function($stateProvider){
    // const tplMatchDetail = <string> require('./views/match_detail.html');
    $stateProvider.state('app.match_detail', {
        cache: false,
        url: '/match_detail/:id',
        views: {
            'menuContent': {
                templateUrl: './templates/match/match_detail.html',
                controller: 'MatchDetailController',
                controllerAs: 'vm',
                /*resolve: {
                    Match: ['$http', 'PATHS', 'stateParams', function($http, PATHS, $stateParams){
                        debugger;
                        return $http.get(PATHS.api + '/match/' + $stateParams.id);
                    }]
                }*/
            }
        },
       
    });
  }]);
