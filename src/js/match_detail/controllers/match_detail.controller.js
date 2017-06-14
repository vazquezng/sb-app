"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MatchDetailController {
    constructor($scope, $http, $state, PATHS, $stateParams, LoginService, toaster, $ionicLoading) {
        this.$http = $http;
        this.$state = $state;
        this.PATHS = PATHS;
        this.toaster = toaster;
        this.$ionicLoading = $ionicLoading;
        const vm = this;
        this.user = LoginService.getUser();
        vm.$http.get(vm.PATHS.api + '/match/' + $stateParams.id)
            .then(function (resp) {
            vm.match = resp.data.match;
            if (vm.match.type == 'singles') {
                vm.match.is_incomplete = vm.match.matchPlayer.length < 2;
            }
            else {
                vm.match.is_incomplete = vm.match.matchPlayer.length < 4;
            }
        });
    }
    acceptUser(matchPlayerId) {
        this.$ionicLoading.show({
            template: `<ion-spinner class="tc-spinner"></ion-spinner>`,
            hideOnStateChange: true,
            showBackdrop: true,
        });
        const vm = this;
        var $paramObj = { id: matchPlayerId, state: 'confirmed' };
        this.$http.post(this.PATHS.api + '/match/updatePlayerRequest', $paramObj).then(function (resp) {
            if (resp.data.success) {
                vm.toaster.pop({ type: 'success', body: 'Confirmaste al usuario!', timeout: 2000 });
                vm.$state.go('app.matchHistory');
            }
            else {
                vm.toaster.pop({ type: 'error', body: 'No se pudo confirmar el usuario', timeout: 2000 });
            }
            vm.$ionicLoading.hide();
        });
    }
    refuseUser(userId) {
    }
    createFeedback(match_id, user_id) {
        const vm = this;
        vm.$state.go('app.feedback', { match_id: match_id, user_id: user_id });
    }
}
MatchDetailController.$inject = ['$scope', '$http', '$state', 'PATHS', '$stateParams', 'LoginService', 'toaster', '$ionicLoading'];
exports.MatchDetailController = MatchDetailController;
angular.module('MatchDetail')
    .controller('MatchDetailController', ['$scope', '$http', '$state', 'PATHS', '$stateParams', 'LoginService', 'toaster', '$ionicLoading', MatchDetailController]);
