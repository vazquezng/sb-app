"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
require("angular-ui-router");
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('Login');
require("./controllers/login.controller.ts");
require("./services/login.service.ts");
angular
    .module('Login')
    .config(['$stateProvider', function ($stateProvider) {
        //const tplAppLogin = <string> require('./views/login.html');
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        });
    }]);
