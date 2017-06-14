"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AchievementsController {
    constructor(Logros, $scope, $http, $state, PATHS, LoginService, toaster) {
        this.Logros = Logros;
        this.$http = $http;
        this.$state = $state;
        this.PATHS = PATHS;
        this.LoginService = LoginService;
        this.toaster = toaster;
        this.user = LoginService.getUser();
        this.avatar = LoginService.isAuth() && this.user.image && this.user.image !== '' ? this.user.image : window.URL_BUCKET + '/img/profile/profile-blank.png';
    }
}
AchievementsController.$inject = ['Logros', '$scope', '$http', '$state', 'PATHS', 'LoginService', 'toaster'];
exports.AchievementsController = AchievementsController;
angular.module('Achievements')
    .controller('AchievementsController', ['Logros', '$scope', '$http', '$state', 'PATHS', 'LoginService', 'toaster', AchievementsController]);
