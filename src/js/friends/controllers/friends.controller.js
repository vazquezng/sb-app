"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FriendsController {
    constructor(Friends, $scope, $http, PATHS) {
        this.Friends = Friends;
        this.$scope = $scope;
        this.$http = $http;
        this.PATHS = PATHS;
        const vm = this;
        this.users = Friends.data.users;
    }
}
FriendsController.$inject = ['Friends', '$scope', '$http', 'PATHS'];
exports.FriendsController = FriendsController;
angular.module('Friends')
    .controller('FriendsController', ['Friends', '$scope', '$http', 'PATHS', FriendsController]);
