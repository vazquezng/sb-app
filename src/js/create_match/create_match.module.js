"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
require("angular-ui-router");
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('CreateMatch');
require("./controllers/create_match.controller.ts");
angular
    .module('CreateMatch')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.createMatch', {
            url: '/create-match',
            views: {
                'menuContent': {
                    templateUrl: 'templates/match/create_match.html',
                    controller: 'CreateMatchController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                UserComplete: ['$http', 'PATHS', 'LoginService', 'toaster', '$state', '$ionicLoading', '$q',
                    function ($http, PATHS, LoginService, toaster, $state, $ionicLoading, $q) {
                        const deferred = $q.defer();
                        if (!LoginService.getUser().complete) {
                            $ionicLoading.hide();
                            toaster.pop({ type: 'error', body: 'Debe completar su perfil primero.' });
                            $state.go('app.profile');
                            deferred.reject(false);
                        }
                        else {
                            deferred.resolve(true);
                        }
                        return deferred.promise;
                    }],
                Canchas: ['$http', 'PATHS', function ($http, PATHS) {
                        return $http.get(`${PATHS.api}/canchas`);
                    }],
            },
            authenticate: true,
        });
    }]);
