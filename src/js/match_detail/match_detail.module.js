"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
require("angular-ui-router");
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('MatchDetail');
require("./controllers/match_detail.controller.ts");
angular
    .module('MatchDetail')
    .config(['$stateProvider', function ($stateProvider) {
        // const tplMatchDetail = <string> require('./views/match_detail.html');
        $stateProvider.state('app.match_detail', {
            cache: false,
            url: '/match_detail/:id',
            views: {
                'menuContent': {
                    templateUrl: './templates/match/match_detail.html',
                    controller: 'MatchDetailController',
                    controllerAs: 'vm',
                }
            },
        });
    }]);
