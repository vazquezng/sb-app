export class MatchDetailController
{
    static $inject = ['$scope', '$http', '$state', 'PATHS', '$stateParams', 'LoginService', 'toaster'];
    public match;
    public users;
    public user;
    constructor($scope, private $http, private $state, private PATHS, $stateParams, LoginService, private toaster){
        const vm = this;
        this.user = LoginService.getUser();
        vm.$http.get(vm.PATHS.api + '/match/' + $stateParams.id)
            .then(function(resp){
                vm.match = resp.data.match;
            });

    }

    public acceptUser(matchPlayerId){
        
        const vm = this;
        var $paramObj = {id: matchPlayerId, state: 'confirmed'};
        
        this.$http.post(this.PATHS.api + '/match/updatePlayerRequest', $paramObj).then(function(resp){
            if(resp.data.success){
                vm.toaster.pop({type: 'success', body: 'Confirmaste al usuario!',timeout: 2000});
                vm.$state.go('app.matchHistory');
            }else{
                vm.toaster.pop({type: 'error', body: 'No se pudo confirmar el usuario',timeout: 2000});
            }
        });
    }

    public refuseUser(userId){
        
    }

    createFeedback(match_id, user_id){
        const vm = this;
        vm.$state.go('app.feedback', { match_id: match_id, user_id: user_id });
    }


}

angular.module('MatchDetail')
        .controller('MatchDetailController', ['$scope', '$http', '$state', 'PATHS', '$stateParams', 'LoginService', 'toaster', MatchDetailController]);
