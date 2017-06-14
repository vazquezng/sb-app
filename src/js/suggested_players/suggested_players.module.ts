import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('SuggestedPlayers');

import './controllers/suggested_players.controller.ts';

angular
  .module('SuggestedPlayers')
  .config(['$stateProvider', function($stateProvider){
    $stateProvider.state('app.suggested_players', {
        cache: false,
        url: '/suggested-players/:match_id',
        views: {
            'menuContent': {
                templateUrl: './templates/suggested_players/suggested_players.html',
                controller: 'SuggestedPlayersController',
                controllerAs: 'vm',
            }
        },
        authenticate: true,
        resolve:{
          Players:['$http', '$stateParams', 'PATHS', function($http, $stateParams, PATHS){
            return $http.get(PATHS.api + '/match/suggested_players/' + $stateParams.match_id);
          }]
        }
    })
  }]);