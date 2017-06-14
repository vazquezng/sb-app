"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
require("angular-ui-router");
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('MyCalifications');
require("./controllers/my_califications.controller.ts");
angular
    .module('MyCalifications')
    .config(['$stateProvider', function ($stateProvider) {
        // const tplMyCalifications = <string> require('./views/my_califications.html');
        $stateProvider
            .state('app.myCalifications', {
            url: '/my_califications',
            views: {
                'menuContent': {
                    templateUrl: './templates/my_califications/my_califications.html',
                    controller: 'MyCalificationsController',
                    controllerAs: 'vm'
                },
            },
            resolve: {
                Califications: ['$http', 'PATHS', function ($http, PATHS) {
                        return $http.get(PATHS.api + '/feedback/califications');
                    }],
            },
            authenticate: true,
        });
    }]);
