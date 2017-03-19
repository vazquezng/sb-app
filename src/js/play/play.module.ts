import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('Play');

import './controllers/play.controller.ts';

angular
  .module('Play')
  .config(['$stateProvider', function($stateProvider){
    const tplAppPlay = <string> require('./views/play.html');
    $stateProvider.state('app.play', {
        url: '/play',
        views: {
            'menuContent': {
                templateUrl: 'templates/match/play.html',
                controller: 'PlayController',
                controllerAs: 'vm',
                resolve:{
                  Matchs:['$http', 'PATHS', function($http, PATHS){
                    return $http.get(PATHS.api + '/match');
                  }]
                }
            }
        },
        
    })
    .state('app.play-detail', {
        url: '/play/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/match/playDetail.html',
                controller: 'PlayDetailController',
                controllerAs: 'vm',
                resolve:{
                  Match:['$http', 'PATHS', '$stateParams', function($http, PATHS, $stateParams){
                    return $http.get(PATHS.api + '/match/'+$stateParams.id);
                  }]
                }
            }
        },
        
    });
  }]);