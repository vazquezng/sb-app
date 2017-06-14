"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
require("angular-ui-router");
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('Play');
require("./controllers/play.controller.ts");
angular
    .module('Play')
    .config(['$stateProvider', function ($stateProvider) {
        // const tplAppPlay = <string> require('./views/play.html');
        $stateProvider.state('app.play', {
            cache: false,
            url: '/play',
            views: {
                'menuContent': {
                    templateUrl: 'templates/match/play.html',
                    controller: 'PlayController',
                    controllerAs: 'vm',
                },
            },
            resolve: {
                Matchs: ['$http', 'PATHS', 'LoginService', 'toaster', '$state', '$ionicLoading',
                    function ($http, PATHS, LoginService, toaster, $state, $ionicLoading) {
                        if (!LoginService.getUser().complete) {
                            $ionicLoading.hide();
                            toaster.pop({ type: 'error', body: 'Debe completar su perfil primero.' });
                            $state.go('app.profile');
                        }
                        return $http.get(PATHS.api + '/match');
                    }],
            },
            authenticate: true,
        })
            .state('app.play-detail', {
            cache: false,
            url: '/play/:id',
            views: {
                'menuContent': {
                    templateUrl: 'templates/match/playDetail.html',
                    controller: 'PlayDetailController',
                    controllerAs: 'vm',
                }
            },
            resolve: {
                Match: ['$http', 'PATHS', '$stateParams', 'LoginService', 'toaster', '$state',
                    function ($http, PATHS, $stateParams, LoginService, toaster, $state) {
                        return $http.get(PATHS.api + '/match/' + $stateParams.id);
                    }]
            },
            authenticate: true,
        });
    }]);
