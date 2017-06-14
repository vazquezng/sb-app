"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('Achievements');
require("./controllers/achievements.controller.ts");
angular
    .module('Achievements')
    .config(['$stateProvider', function ($stateProvider) {
        // const tplApp = <string> require('./views/achievements.html');
        $stateProvider.state('app.logros', {
            cache: false,
            url: '/logros',
            views: {
                'menuContent': {
                    templateUrl: './templates/achievements/achievements.html',
                    controller: 'AchievementsController',
                    controllerAs: 'vm',
                }
            },
            resolve: {
                Logros: ['$http', 'PATHS', function ($http, PATHS) {
                        return $http.get(PATHS.api + '/match');
                    }]
            },
            authenticate: true,
        });
    }]);
