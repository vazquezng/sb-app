let vm;
class ProfileController {
    constructor(LoginService, $http, $state, $scope, PATHS, Upload, toaster, $ionicHistory) {
        this.LoginService = LoginService;
        this.$http = $http;
        this.$state = $state;
        this.$scope = $scope;
        this.PATHS = PATHS;
        this.Upload = Upload;
        this.toaster = toaster;
        this.$ionicHistory = $ionicHistory;
        this.availabilityList = [];
        this.completeForm = false;
        this.emailFormat = /^[a-z]+[a-z0-9._\-]+@[a-z]+\.[a-z]{2,5}\.?[a-z]{0,5}$/;
        this.stopSave = false;
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        if (!LoginService.isAuth()) {
            $state.go('login');
        }
        this.user = LoginService.getUser();
        vm = this;
        vm.avatar = this.user.image && this.user.image !== '' ? this.user.image : window.URL_BUCKET + '/img/profile/profile-blank.png';
        this.city = this.user.city;
        this.country = this.user.country;
        this.address = this.user.address;
        this.user.game_level = this.user.game_level ? this.user.game_level.toString() : this.user.game_level;
        this.user.itn = this.user.itn ? this.user.itn.toString() : this.user.itn;
        this.user.single = (this.user.single == 1);
        this.user.double = (this.user.double == 1);
        $scope.$watch('image', function (newImage, lastImage) {
            if (newImage && newImage !== lastImage) {
                var formData = new FormData();
                formData.append("file", newImage);
                vm.Upload.upload({
                    url: vm.PATHS.api + '/user/profile/image',
                    data: { file: newImage, 'name': vm.user.name }
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    vm.user.image = resp.data;
                    vm.avatar = resp.data;
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    //let progressPercentage:any = parseInt( 100.0 * evt.loaded / evt.total );
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        });
    }
    getPictureCam() {
        window.navigator.camera.getPicture(this.onSuccess, this.onFail, { quality: 25,
            destinationType: window.Camera.DestinationType.DATA_URL,
            sourceType: window.Camera.PictureSourceType.CAMERA,
            encodingType: window.Camera.EncodingType.JPEG,
            correctOrientation: true,
            cameraDirection: 1,
        });
    }
    getPictureAlbum() {
        window.navigator.camera.getPicture(this.onSuccess, this.onFail, { quality: 25,
            destinationType: window.Camera.DestinationType.DATA_URL,
            sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: window.Camera.EncodingType.JPEG,
        });
    }
    onSuccess(imageURI) {
        vm.avatar = 'data:image/jpeg;base64,' + imageURI;
        vm.$scope.$apply();
        /*vm.$http.post(vm.PATHS.api +'/user/profile/imagestr', {data: vm.avatar})
            .then(function(resp){
                vm.avatar = resp.data;
                vm.user.image = resp.data;
                vm.$scope.$apply();
            });*/
    }
    onFail(message) {
        console.log('Failed because: ' + message);
    }
    saveAvailability() {
        var params = { availability: this.availabilityList };
        const vm = this;
        this.$http.post(this.PATHS.api + '/user/saveAvailability', params).then(function (resp) {
            if (resp.data.success) {
                vm.toaster.pop({ type: 'success', body: 'Tu disponibilidad se guardo correctamente!', timeout: 2000 });
                vm.modalInstance.close();
            }
            else {
                vm.toaster.pop({ type: 'error', body: 'Ocurrió un error al guardar tu disponibilidad', timeout: 2000 });
            }
        });
    }
    updateAvailability(weekDay, time) {
        var index = this.availabilityList.indexOf(weekDay + '-' + time);
        if (index == -1) {
            this.availabilityList[this.availabilityList.length] = weekDay + '-' + time;
        }
        else {
            this.availabilityList.splice(index, 1);
        }
    }
    getCountryFromAddress() {
        for (var i = 0; i < this.address.address_components.length; i++) {
            for (var j = 0; j < this.address.address_components[i].types.length; j++) {
                if (this.address.address_components[i].types[j] == "country") {
                    return this.address.address_components[i].long_name;
                }
            }
        }
    }
    save(form) {
        const vm = this;
        if (this.) {
        }
        if (this.address != this.user.address && (!this.address.types || this.address.types[0] != "street_address")) {
            vm.toaster.pop({ type: 'error', body: 'El campo dirección debe contener una dirección exácta', timeout: 2000 });
            return;
        }
        if (form.$valid && !this.stopSave) {
            this.stopSave = true;
            this.completeForm = false;
            /*this.user.city = this.city && this.city.formatted_address ? this.city.formatted_address : this.city;
            this.user.country =  this.country && this.country.address_components ? this.country.address_components[this.country.address_components.length-1].long_name : this.country;*/
            this.user.city = this.address.types && this.address.types[0] == "street_address" ? this.address.vicinity : this.user.city;
            this.user.country = this.address.types && this.address.types[0] == "street_address" ? this.getCountryFromAddress() : this.user.country;
            this.user.address = this.address && this.address.formatted_address ? this.address.formatted_address : this.address;
            this.user.address_lat = this.address && this.address.geometry ? this.address.geometry.location.lat() : this.user.lat;
            this.user.address_lng = this.address && this.address.geometry ? this.address.geometry.location.lng() : this.user.lng;
            this.$http.post(this.PATHS.api + '/user', this.user).then(function (resp) {
                vm.stopSave = false;
                if (resp.data.success) {
                    vm.toaster.pop({ type: 'success', body: 'Tu perfil se guardó correctamente.', timeout: 2000 });
                    vm.user.complete = true;
                    vm.user.image = vm.avatar;
                    vm.LoginService.setUser(vm.user);
                    //vm.$state.reload();
                }
                else {
                    vm.toaster.pop({ type: 'error', body: 'Hubo un error, intente más tarde', timeout: 2000 });
                }
            });
        }
        else {
            vm.stopSave = false;
            //Darle un mensaje al usuario de que debe completar los datos
            vm.toaster.pop({ type: 'error', body: 'Completar todos los datos del formulario', timeout: 2000 });
            //this.completeForm= true;
        }
    }
}
ProfileController.$inject = ['LoginService', '$http', '$state', '$scope', 'PATHS', 'Upload', 'toaster', '$ionicHistory'];
class ProfileAvailabilityController {
    constructor(Availability, LoginService, $http, $state, PATHS, toaster) {
        this.Availability = Availability;
        this.LoginService = LoginService;
        this.$http = $http;
        this.$state = $state;
        this.PATHS = PATHS;
        this.toaster = toaster;
        this.availabilityList = [];
        this.completeForm = false;
        this.timeList = ['08:00', '08:30',
            '09:00', '09:30',
            '10:00', '10:30',
            '11:00', '11:30',
            '12:00', '12:30',
            '13:00', '13:30',
            '14:00', '14:30',
            '15:00', '15:30',
            '16:00', '16:30',
            '17:00', '17:30',
            '18:00', '18:30',
            '19:00', '19:30',
            '20:00', '20:30',
            '21:00', '21:30',
            '22:00', '22:30',
            '23:00', '23:30'];
        this.dayList = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
        if (!LoginService.isAuth()) {
            $state.go('login');
        }
        this.availabilityList = Availability.data.availability;
    }
    back() {
        this.$state.go('app.profile');
    }
    save() {
        var params = { availability: this.availabilityList };
        const vm = this;
        this.$http.post(this.PATHS.api + '/user/saveAvailability', params).then(function (resp) {
            if (resp.data.success) {
                vm.toaster.pop({ type: 'success', body: 'Tu disponibilidad se guardo correctamente!', timeout: 2000 });
            }
            else {
                vm.toaster.pop({ type: 'error', body: 'Ocurrió un error al guardar tu disponibilidad', timeout: 2000 });
            }
        });
    }
    updateAvailability(weekDay, time) {
        var index = this.availabilityList.indexOf(weekDay + '-' + time);
        if (index == -1) {
            this.availabilityList[this.availabilityList.length] = weekDay + '-' + time;
        }
        else {
            this.availabilityList.splice(index, 1);
        }
    }
}
ProfileAvailabilityController.$inject = ['Availability', 'LoginService', '$http', '$state', 'PATHS', 'toaster'];
angular.module('Profile')
    .controller('ProfileController', ['LoginService', '$http', '$state', '$scope', 'PATHS', 'Upload', 'toaster', '$ionicHistory', ProfileController])
    .controller('ProfileAvailabilityController', ['Availability', 'LoginService', '$http', '$state', 'PATHS', 'toaster', ProfileAvailabilityController]);
