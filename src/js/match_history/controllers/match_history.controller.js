"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MatchHistoryController {
    constructor(Matches, $state) {
        this.Matches = Matches;
        this.$state = $state;
        const vm = this;
        this.matches = Matches.data.matches;
    }
    showDetail(id) {
        const vm = this;
        vm.$state.go('app.match_detail', { id: id });
    }
}
MatchHistoryController.$inject = ['Matches', '$state'];
exports.MatchHistoryController = MatchHistoryController;
angular.module('MatchHistory')
    .controller('MatchHistoryController', ['Matches', '$state', MatchHistoryController]);
