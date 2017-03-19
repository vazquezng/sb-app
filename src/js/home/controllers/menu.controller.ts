import * as angular from 'angular';

class MenuController 
{   
    static $inject = ['$rootScope'];

    public user;
    constructor(private LoginService, $rootScope){
        this.user = LoginService.getUser();
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