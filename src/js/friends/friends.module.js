"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
require("angular-ui-router");
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('Friends');
require("./controllers/friends.controller.ts");
angular
    .module('Friends')
    .config(['$stateProvider', function ($stateProvider) {
        //const tplAppFriends = <string> require('./views/friends.html');
        $stateProvider.state('app.friends', {
            url: '/friends',
            templateUrl: './templates/friends/friends.html',
            controller: 'FriendsController',
            controllerAs: 'vm',
            resolve: {
                Friends: ['$http', 'PATHS', function ($http, PATHS) {
                        return $http.get(PATHS.api + '/match/friends');
                    }]
            }
        });
    }]);
