let vm;

class ProfileController {
    static $inject = ['LoginService', '$http', '$state', '$scope', 'PATHS', 'Upload', 'toaster', '$ionicHistory'];

    public user;
    public image;
    public avatar;

    public country;
    public city;
    public address;
    public modalInstance;
    public availabilityList = [];
    public completeForm =false;
    private emailFormat = /^[a-z]+[a-z0-9._\-]+@[a-z]+\.[a-z]{2,5}\.?[a-z]{0,5}$/;

    public stopSave = false;
    constructor (private LoginService, private $http, private $state, private $scope, private PATHS, private Upload,private toaster, private $ionicHistory){
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        if(!LoginService.isAuth()){
            $state.go('login');
        }

        this.user = LoginService.getUser();
        vm =  this;
        vm.avatar = this.user.image && this.user.image !== '' ? this.user.image : (<any>window).URL_BUCKET+'/img/profile/profile-blank.png';
        this.city = this.user.city;
        this.country = this.user.country;
        this.address = this.user.address;

        if((<any>window).localStorage.getItem('UserTmp-profile')){
            vm.user = JSON.parse((<any>window).localStorage.getItem('UserTmp-profile'));
            (<any>window).localStorage.removeItem('UserTmp-profile');
        }

        this.user.game_level = this.user.game_level ? this.user.game_level.toString(): this.user.game_level;
        this.user.itn = this.user.itn ? this.user.itn.toString(): this.user.itn;
        this.user.single = (this.user.single==1);
        this.user.double = (this.user.double==1);

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
    }

     public getPictureCam(){
        (<any>window).navigator.camera.getPicture(this.onSuccess, this.onFail, { quality: 25,
            destinationType: (<any>window).Camera.DestinationType.DATA_URL,
            sourceType: (<any>window).Camera.PictureSourceType.CAMERA,
            encodingType: (<any>window).Camera.EncodingType.JPEG,
            correctOrientation: true,
            cameraDirection: 1,
        });
    }

    public getPictureAlbum(){
        (<any>window).navigator.camera.getPicture(this.onSuccess, this.onFail, { quality: 25,
            destinationType: (<any>window).Camera.DestinationType.DATA_URL,
            sourceType: (<any>window).Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: (<any>window).Camera.EncodingType.JPEG,
        });
    }

    private onSuccess(imageURI){
        vm.avatar = 'data:image/jpeg;base64,'+imageURI;
        const blob = vm.Upload.dataUrltoBlob('data:image/jpeg;base64,'+imageURI, 'avatar');
        vm.Upload.upload({
            url: vm.PATHS.api + '/user/profile/image',
            data: {file: vm.Upload.rename(blob, 'avatar.jpg')}
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

        vm.$scope.$apply();
    }

    private onFail(message) {
        console.log('Failed because: ' + message);
    }

    private  saveAvailability(){
        var params = {availability: this.availabilityList};
        const vm = this;
        this.$http.post(this.PATHS.api + '/user/saveAvailability', params).then(function(resp){
            if(resp.data.success){
                vm.toaster.pop({type: 'success', body: 'Tu disponibilidad se guardo correctamente!',timeout: 2000});
                vm.modalInstance.close();
            }else{
                vm.toaster.pop({type: 'error', body: 'Ocurrió un error al guardar tu disponibilidad',timeout: 2000});
            }
        });
    }

    public goAvailability(){
        (<any>window).localStorage.setItem('UserTmp-profile', JSON.stringify(this.user));
        this.$state.go('app.profile-availability');
    }

    public updateAvailability(weekDay, time){
        var index = this.availabilityList.indexOf(weekDay+'-'+time);
        if(index == -1){
          this.availabilityList[this.availabilityList.length] = weekDay+'-'+time;
        }else{
          this.availabilityList.splice(index,1);
        }
    }

    private getCountryFromAddress(){
        for (var i=0; i < this.address.address_components.length; i++) {
          for (var j=0; j < this.address.address_components[i].types.length; j++) {
            if (this.address.address_components[i].types[j] == "country") {
              return this.address.address_components[i].long_name;
            }
          }
        }
    }

    public save(form){
        const vm = this;
        if(!this.emailFormat.test(this.user.email)){
            vm.toaster.pop({type: 'error', body: 'El email tiene un formato invalido.',timeout: 2000});
            return;
        }
        if(this.address != this.user.address && (!this.address.types || this.address.types[0] != "street_address")){
             vm.toaster.pop({type: 'error', body: 'El campo dirección debe contener una dirección exácta',timeout: 2000});
             return;
        }

        if(form.$valid && !this.stopSave){
            this.stopSave = true;
            this.completeForm= false;
            /*this.user.city = this.city && this.city.formatted_address ? this.city.formatted_address : this.city;
            this.user.country =  this.country && this.country.address_components ? this.country.address_components[this.country.address_components.length-1].long_name : this.country;*/
            this.user.city = this.address.types && this.address.types [0]=="street_address" ? this.address.vicinity : this.user.city;
            this.user.country = this.address.types && this.address.types [0]=="street_address" ? this.getCountryFromAddress(): this.user.country;
            this.user.address = this.address && this.address.formatted_address ? this.address.formatted_address : this.address;
            this.user.address_lat = this.address && this.address.geometry ? this.address.geometry.location.lat() : this.user.lat;
            this.user.address_lng = this.address && this.address.geometry ? this.address.geometry.location.lng() : this.user.lng;

            this.$http.post(this.PATHS.api + '/user', this.user).then(function(resp){
                vm.stopSave = false;
                if(resp.data.success){
                    vm.toaster.pop({type: 'success', body: 'Tu perfil se guardó correctamente.',timeout: 2000});
                    vm.user.complete = true;
                    vm.LoginService.setUser(vm.user);
                }else{
                    vm.toaster.pop({type: 'error', body: 'Hubo un error, intente más tarde',timeout: 2000});
                }
            });
        }else{
            vm.stopSave = false;
            //Darle un mensaje al usuario de que debe completar los datos
            vm.toaster.pop({type: 'error', body: 'Completar todos los datos del formulario', timeout: 2000});
        }
    }
}

class ProfileAvailabilityController {
    static $inject = ['Availability','LoginService', '$http', '$state', 'PATHS', 'toaster'];

    public availabilityList = [];
    public completeForm =false;
    public timeList = [ '08:00','08:30',
                        '09:00','09:30',
                        '10:00','10:30',
                        '11:00','11:30',
                        '12:00','12:30',
                        '13:00','13:30',
                        '14:00','14:30',
                        '15:00','15:30',
                        '16:00','16:30',
                        '17:00','17:30',
                        '18:00','18:30',
                        '19:00','19:30',
                        '20:00','20:30',
                        '21:00','21:30',
                        '22:00','22:30',
                        '23:00','23:30'];
    public dayList = [ 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    constructor (private Availability, private LoginService, private $http, private $state, private PATHS, private toaster){
        if(!LoginService.isAuth()){
            $state.go('login');
        }

        this.availabilityList = Availability.data.availability;
    }

    public back(){
        this.$state.go('app.profile');
    }

    public save(){
        var params = {availability: this.availabilityList};
        const vm = this;
        this.$http.post(this.PATHS.api + '/user/saveAvailability', params).then(function(resp){
            if(resp.data.success){
                vm.toaster.pop({type: 'success', body: 'Tu disponibilidad se guardo correctamente!', timeout: 2000});
            }else{
                vm.toaster.pop({type: 'error', body: 'Ocurrió un error al guardar tu disponibilidad', timeout: 2000});
            }
        });
    }

    public updateAvailability(weekDay, time){
        var index = this.availabilityList.indexOf(weekDay+'-'+time);
        if(index == -1){
            this.availabilityList[this.availabilityList.length] = weekDay+'-'+time;
        }else{
            this.availabilityList.splice(index,1);
        }
    }
}

angular.module('Profile')
    .controller('ProfileController', ['LoginService', '$http', '$state', '$scope', 'PATHS', 'Upload', 'toaster', '$ionicHistory', ProfileController])
    .controller('ProfileAvailabilityController', ['Availability', 'LoginService', '$http', '$state', 'PATHS', 'toaster', ProfileAvailabilityController]);
