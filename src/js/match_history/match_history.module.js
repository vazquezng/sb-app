"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
require("angular-ui-router");
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('MatchHistory');
require("./controllers/match_history.controller.ts");
angular
    .module('MatchHistory')
    .config(['$stateProvider', function ($stateProvider) {
        // const tplMatchHistory = <string> require('./views/match_history.html');
        $stateProvider.state('app.matchHistory', {
            cache: false,
            url: '/match_history',
            views: {
                'menuContent': {
                    templateUrl: './templates/match/match_history.html',
                    controller: 'MatchHistoryController',
                    controllerAs: 'vm',
                    resolve: {
                        Matches: ['$http', 'PATHS', function ($http, PATHS) {
                                return $http.get(PATHS.api + '/match/history');
                            }]
                    }
                }
            },
        });
    }]);
