"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
require("angular-ui-router");
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('SuggestedPlayers');
require("./controllers/suggested_players.controller.ts");
angular
    .module('SuggestedPlayers')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.suggested_players', {
            url: '/suggested-players/:match_id',
            views: {
                'menuContent': {
                    templateUrl: './templates/suggested_players/suggested_players.html',
                    controller: 'SuggestedPlayersController',
                    controllerAs: 'vm',
                }
            },
            authenticate: true,
            resolve: {
                Players: ['$http', '$stateParams', 'PATHS', function ($http, $stateParams, PATHS) {
                        return $http.get(PATHS.api + '/match/suggested_players/' + $stateParams.match_id);
                    }]
            }
        });
    }]);
