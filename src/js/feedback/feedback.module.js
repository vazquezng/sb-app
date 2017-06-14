"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
require("angular-ui-router");
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('Feedback');
require("./controllers/feedback.controller.ts");
angular
    .module('Feedback')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.feedback', {
            cache: false,
            url: '/feedback/:match_id/:user_id',
            views: {
                'menuContent': {
                    templateUrl: './templates/feedback/_feedback.html',
                    controller: 'FeedbackController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                Load: ['$http', '$state', 'PATHS', '$stateParams', function ($http, $state, PATHS, $stateParams) {
                        return $http.get(PATHS.api + '/feedback/detail/' + $stateParams.match_id + '/' + $stateParams.user_id);
                    }]
            },
            authenticate: true,
        });
    }]);
