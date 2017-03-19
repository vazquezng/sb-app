export class MatchHistoryController 
{   
    static $inject = ['Matches', '$state'];

    public matches;
    constructor(private Matches, private $state){
        const vm = this;
        this.matches = Matches.data.matches;
    }

    public showDetail(id){
        const vm = this;
        vm.$state.go('app.match_detail', { id: id });
    }
}

angular.module('MatchHistory')
        .controller('MatchHistoryController', ['Matches', '$state', MatchHistoryController]);