"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayController {
    constructor(Matchs, LoginService, $scope, $http, PATHS, $state) {
        this.Matchs = Matchs;
        this.LoginService = LoginService;
        this.$scope = $scope;
        this.$http = $http;
        this.PATHS = PATHS;
        this.$state = $state;
        this.user = LoginService.getUser();
        const vm = this;
        this.matchs = Matchs.data.matchs;
        $scope.close = function () {
            vm.modalInstance.close();
        };
    }
    openMaps(lat, lng) {
        this.$scope.map = { center: { latitude: lat, longitude: lng }, zoom: 16 };
        this.$scope.timestamp = new Date().getTime();
    }
    detail(id) {
        console.log(id);
        this.$state.go('app.play-detail', { id: id });
    }
    openModalPlay(match) {
        const vm = this;
        this.$scope.match = match;
        this.$scope.map = { center: { latitude: match.address_lat, longitude: match.address_lng }, zoom: 16 };
        this.$scope.timestamp = new Date().getTime();
        vm.$http.get(vm.PATHS.api + '/match/players/' + vm.$scope.match.id)
            .then(function (resp) {
            match['users'] = resp.data[0].users;
            vm.playBtn = resp.data[1].canPlay;
        });
        this.$scope.play = function () {
            vm.$http.post(vm.PATHS.api + '/match/play', { id: vm.$scope.match.id })
                .then(function (resp) {
                if (resp.data.success) {
                    vm.modalInstance.close();
                }
            });
        };
    }
}
PlayController.$inject = ['Matchs', 'LoginService', '$scope', '$http', 'PATHS', '$state'];
exports.PlayController = PlayController;
class PlayDetailController {
    constructor(Match, LoginService, $scope, $http, PATHS, $state) {
        this.Match = Match;
        this.LoginService = LoginService;
        this.$scope = $scope;
        this.$http = $http;
        this.PATHS = PATHS;
        this.$state = $state;
        this.user = LoginService.getUser();
        const vm = this;
        this.match = Match.data.match;
        this.match.matchPlayer.forEach(function (player) {
            if (player.id_user === vm.match.id_user) {
                vm.match.userCreate = player.user;
            }
        });
    }
    play() {
        const vm = this;
        vm.$http.post(vm.PATHS.api + '/match/play', { id: vm.match.id })
            .then(function (resp) {
            if (resp.data.success) {
                vm.$state.reload();
            }
        });
    }
}
PlayDetailController.$inject = ['Match', 'LoginService', '$scope', '$http', 'PATHS', '$state'];
angular.module('Home')
    .controller('PlayController', ['Matchs', 'LoginService', '$scope', '$http', 'PATHS', '$state', PlayController])
    .controller('PlayDetailController', ['Match', 'LoginService', '$scope', '$http', 'PATHS', '$state', PlayDetailController]);
