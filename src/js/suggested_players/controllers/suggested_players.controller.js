"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SuggestedPlayersController {
    constructor(Players, $scope, $http, $stateParams, PATHS, toaster, $ionicLoading) {
        this.Players = Players;
        this.$scope = $scope;
        this.$http = $http;
        this.$stateParams = $stateParams;
        this.PATHS = PATHS;
        this.$ionicLoading = $ionicLoading;
        this.toaster = toaster;
        this.users = Players.data.players;
        this.other_players = Players.data.other_players;
        this.match_id = $stateParams.match_id;
    }
    invite(user_id) {
        const vm = this;
        var paramObj = { user_id: user_id, match_id: this.match_id };
        this.$ionicLoading.show({
            template: `<ion-spinner class="tc-spinner"></ion-spinner>`,
            hideOnStateChange: true,
            showBackdrop: true,
        });
        this.$http.post(this.PATHS.api + '/match/invite', paramObj).then(function (resp) {
            vm.$ionicLoading.hide();
            if (resp.data.success) {
                vm.toaster.pop({ type: 'info', body: 'Invitación enviada.' });
            }
        });
    }
}
SuggestedPlayersController.$inject = ['Players', '$scope', '$http', '$stateParams', 'PATHS', 'toaster', '$ionicLoading'];
exports.SuggestedPlayersController = SuggestedPlayersController;
angular.module('SuggestedPlayers')
    .controller('SuggestedPlayersController', ['Players', '$scope', '$http', '$stateParams', 'PATHS', 'toaster', '$ionicLoading', SuggestedPlayersController]);
