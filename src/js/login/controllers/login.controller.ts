import * as angular from 'angular';

export class LoginController
{
    static $inject = ['$http','PATHS', 'LoginService', '$ionicLoading', '$state', '$cordovaOauth'];
    private params = {};
    constructor(private $http, private PATHS, private LoginService, private $ionicLoading, private $state, private $cordovaOauth){
    }

    public authenticate = function(provider:string){
       this[provider]();
    }

    public facebook = function(){
        const vm = this;
        // This is the fail callback from the login method
        var fbLoginError = function(error) {
            console.log(error);
            vm.$ionicLoading.hide();
            vm.$state.go('app.profile');
        };

        // This is the success callback from the login method
        var fbLoginSuccess = function(response) {
            vm.$ionicLoading.hide();
            if (!response.authResponse) {
                fbLoginError('Cannot find the authResponse');
                return;
            }
            console.log(response);
            setUserApi(response.authResponse);
        };

        var setUserApi = (data)=>{
            vm.$http.post(vm.PATHS.api+'/auth', {accessToken: data.accessToken, id: data.userID})
            .then(function(resp:any){
                vm.LoginService.login(resp.data);
            });
        };

        (<any>window).facebookConnectPlugin.getLoginStatus(function(success) {
                if (success.status === 'connected') {
                    // the user is logged in and has authenticated your app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed request, and the time the access token
                    // and signed request each expire

                    console.log(success);
                    vm.$ionicLoading.hide();
                    setUserApi(success.authResponse);
                } else {
                    vm.$ionicLoading.show();

                    // ask the permissions you need. You can learn more about FB permissions
                    //  here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                    (<any>window).facebookConnectPlugin.login(["email", "public_profile", "user_friends"], fbLoginSuccess, fbLoginError);
                }
            });
    }

    private twitter(){
        //$state.go('app.profile');
        const vm = this;
        this.$cordovaOauth.twitter('Zn0FeVdQOJ6Owo23eiwj2Agil', 'cPUQa4vbj8DELrGT03ssgEphYhDufu9Zf0RU6X4hBQH5nyXdFB').then(function(resp) {
            console.log(resp);
        });
        //(<any>window).location = (<any>window).API_URL.replace('/api/v1', '') + '/auth/twitter' ;
    }

    private getUserFacebook(authResponse){
        const vm = this;
        (<any>window).FB.api('/me', {
            fields: 'first_name, last_name, email'
        }, function(response) {
            (<any>vm).params = response;
            (<any>vm).params.accessToken = authResponse.accessToken;
            (<any>vm).params.provider = 'facebook';
            vm.$http.post(vm.PATHS.api + '/auth', vm.params).then(function(resp){
                vm.LoginService.login(resp.data);
            });
        });
    }
}

class AuthTwitterController{
    static $inject = ['User', 'LoginService', '$stateParams'];

    constructor(private User, private LoginService, private $stateParams){
        let data:any = {};

        data.user = User.data.user;
        data.token = {token: $stateParams.token};
        if($stateParams.newuser == 'true'){
            data.newuser =true;
        }else{
            data.newuser = false;
            data.state = 'app.home';
        }

        LoginService.login(data);
    }
}

angular.module('Login')
        .controller('LoginController', ['$http', 'PATHS', 'LoginService', '$ionicLoading', '$state', '$cordovaOauth', LoginController])
        .controller('AuthTwitterController', ['User', 'LoginService', '$stateParams', AuthTwitterController]);
