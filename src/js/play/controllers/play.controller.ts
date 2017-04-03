export class PlayController
{
    static $inject = ['Matchs', 'LoginService', '$scope', '$http', 'PATHS', '$state'];

    public modalInstance;
    public matchs;
    public user;
    public playBtn;

    constructor(private Matchs, private LoginService, private $scope, private $http, private PATHS, private $state){
        this.user = LoginService.getUser();
        const vm = this;
        this.matchs = Matchs.data.matchs;
        $scope.close = function(){
            vm.modalInstance.close();
        };
    }

    public openMaps(lat, lng){
        this.$scope.map = { center: { latitude: lat, longitude: lng }, zoom: 16 };
        this.$scope.timestamp = new Date().getTime();
    }
    public detail(id){
      console.log(id);
      this.$state.go('app.play-detail',{id:id});
    }

    public openModalPlay(match){
        const vm = this;
        this.$scope.match = match;
        this.$scope.map = { center: { latitude: match.address_lat, longitude: match.address_lng }, zoom: 16 };
        this.$scope.timestamp = new Date().getTime();

        vm.$http.get(vm.PATHS.api + '/match/players/' + vm.$scope.match.id)
        .then(function(resp){
            match['users'] = resp.data[0].users;
            vm.playBtn = resp.data[1].canPlay;

        });

        this.$scope.play = function(){
            vm.$http.post(vm.PATHS.api + '/match/play', {id: vm.$scope.match.id})
                    .then(function(resp){
                        if(resp.data.success){
                            vm.modalInstance.close();
                        }
                    });
        };
    }
}

class PlayDetailController {
    static $inject = ['Match', 'LoginService', '$scope', '$http', 'PATHS', '$state'];

    public modalInstance;
    public match;
    public user;
    public playBtn;

    constructor(private Match, private LoginService, private $scope, private $http, private PATHS, private $state){
        this.user = LoginService.getUser();
        const vm =  this;
        this.match = Match.data.match;
        this.match.matchPlayer.forEach(function(player){
            if(player.id_user === vm.match.id_user){
                vm.match.userCreate = player.user;
            }
        });
    }

    public play(){
        const vm = this;
        vm.$http.post(vm.PATHS.api + '/match/play', {id: vm.match.id})
        .then(function(resp){
            if(resp.data.success){
                vm.$state.reload();
            }
        });
    }
}

angular.module('Home')
        .controller('PlayController', ['Matchs','LoginService', '$scope', '$http', 'PATHS', '$state' ,PlayController])
        .controller('PlayDetailController', ['Match','LoginService', '$scope', '$http', 'PATHS','$state' ,PlayDetailController]);
