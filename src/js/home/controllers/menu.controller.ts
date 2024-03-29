import * as angular from 'angular';

class MenuController
{
    static $inject = ['$rootScope'];

    public user;
    public avatar;
    constructor(private LoginService, $rootScope){
        this.user = LoginService.getUser();
        this.avatar = this.user.image && this.user.image !== '' ? this.user.image : (<any>window).URL_BUCKET+'/img/profile/profile-blank.png';
        const vm = this;
        $rootScope.$on('login', function(){
            vm.user = LoginService.getUser();
        });
    }

    public logout(){
        this.LoginService.logout();
    }

    public auth(){
       this.LoginService.init();
    }
}

angular.module('Home')
        .controller('MenuController', ['LoginService', '$rootScope', MenuController]);
