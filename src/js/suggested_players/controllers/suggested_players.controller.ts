export class SuggestedPlayersController
{
    static $inject = ['Players', '$scope', '$http', '$stateParams', 'PATHS', 'toaster', '$ionicLoading'];

    private users;

    private other_players;

    public toaster;

    public match_id;

    private suggestedPlayers = [];
    public viewUsers = [];
    public isHereUsers = false;
    public notMatch = false;
    constructor(private Players, private $scope, private $http, private $stateParams, private PATHS, toaster, private $ionicLoading){
        this.toaster = toaster;
        this.users = Players.data.players;
        this.other_players = Players.data.other_players;
        const vm = this;
        if(this.users && this.users.length>0){
          this.users.forEach(u => vm.suggestedPlayers.push(u));
        }
        if(this.other_players && this.other_players.length>0){
          this.other_players.forEach(u => vm.suggestedPlayers.push(u));
        }
        this.isHereUsers = (this.users && this.users.length > 0);
        this.notMatch = (!this.users && !this.other_players);
        this.match_id = $stateParams.match_id;

        if(this.suggestedPlayers.length>0){
          this.insertUser();
          this.insertUser();
        }
    }

    private insertUser() {
      if(this.suggestedPlayers[0]){
        this.viewUsers.push(this.suggestedPlayers[0]);
        this.suggestedPlayers = this.suggestedPlayers.slice(1, this.suggestedPlayers.length );
      }
    }

    public clearUser($index){
      this.viewUsers.splice($index, 1);
      this.insertUser();
    }

    public invite(user_id, $index){
        const vm = this;
        this.clearUser($index);
        var paramObj = {user_id: user_id, match_id: this.match_id};
        this.$ionicLoading.show({
            template: `<ion-spinner class="tc-spinner"></ion-spinner>`,
            hideOnStateChange: true,
            showBackdrop: true,
        });
        this.$http.post(this.PATHS.api + '/match/invite', paramObj).then(function(resp){
            vm.$ionicLoading.hide();
            if(resp.data.success){
                vm.toaster.pop({type:'info', body:'Invitación enviada.'})
            }
        });
    }
}

angular.module('SuggestedPlayers')
        .controller('SuggestedPlayersController', ['Players', '$scope', '$http', '$stateParams', 'PATHS', 'toaster', '$ionicLoading', SuggestedPlayersController]);
