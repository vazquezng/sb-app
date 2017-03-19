class ProfileController {
    static $inject = ['LoginService', '$http', '$state', '$scope', 'PATHS', 'Upload'];

    public user;
    public image;
    public avatar;

    public country;
    public city;
    public address;
    public modalInstance;
    constructor (private LoginService, private $http, private $state, private $scope, private PATHS, private Upload){
        if(!LoginService.isAuth()){
            $state.go('login');

            return null;
        }

        this.user = LoginService.getUser();
        let vm =  this;
        vm.avatar = this.user && this.user.image && this.user.image !== '' ? this.user.image : (<any>window).URL_BUCKET+'/img/profile-blank.png';
        this.city = this.user.city || '';
        this.country = this.user.country;
        this.address = this.user.address;

        this.user.game_level = this.user.game_level ? this.user.game_level.toString(): this.user.game_level;
        this.user.itn = this.user.itn ? this.user.itn.toString(): this.user.itn;
        this.user.single = (this.user.single==1);
        this.user.double = (this.user.double==1);

        this.user.club_member = (this.user.club_member && this.user.club_member >= 0) ? this.user.club_member.toString(): this.user.club_member;

        $scope.$watch('image', function(newImage, lastImage){
            if(newImage && newImage !== lastImage){
                var formData = new FormData();
                formData.append("file", newImage);
                vm.Upload.upload({
                    url: vm.PATHS.api + '/user/profile/image',
                    data: {file: newImage, 'name': vm.user.name}
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    vm.user.image = resp.data;
                    vm.avatar = resp.data;
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt:any) {
                    //let progressPercentage:any = parseInt( 100.0 * evt.loaded / evt.total );
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        });


        $scope.save = function(){
            vm.saveAvailability();
        };
    }

    public openModalAvailable(){
        /*this.modalInstance = this.$uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'availability-profile',
            size: 'md',
            scope:this.$scope
        });*/
    }

    private  saveAvailability(){
        this.modalInstance.close();
    }

    public save(){
        this.user.city = this.city && this.city.formatted_address ? this.city.formatted_address : this.city;
        this.user.country =  this.country && this.country.address_components ? this.country.address_components[this.country.address_components.length-1].long_name : this.country;
        this.user.address = this.address && this.address.formatted_address ? this.address.formatted_address : this.address;
        this.user.lat = this.address && this.address.geometry ? this.address.geometry.location.lat() : this.user.lat;
        this.user.lng = this.address && this.address.geometry ? this.address.geometry.location.lng() : this.user.lng;

        const vm = this;
        this.$http.post(this.PATHS.api + '/user', this.user).then(function(resp){
            if(resp.data.success){
                vm.LoginService.setUser(vm.user);
                vm.$state.reload();
            }
        });
    }
}

angular.module('Profile')
    .controller('ProfileController', ['LoginService', '$http', '$state', '$scope', 'PATHS', 'Upload', '$scope', ProfileController]);
