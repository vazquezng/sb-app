"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
class MenuController {
    constructor(LoginService, $rootScope) {
        this.LoginService = LoginService;
        this.user = LoginService.getUser();
        const vm = this;
        $rootScope.$on('login', function () {
            vm.user = LoginService.getUser();
        });
    }
    logout() {
        this.LoginService.logout();
    }
    auth() {
        this.LoginService.init();
    }
}
MenuController.$inject = ['$rootScope'];
angular.module('Home')
    .controller('MenuController', ['LoginService', '$rootScope', MenuController]);
