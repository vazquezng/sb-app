"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
// import { TwitterConnect } from '@ionic-native/twitter-connect';
class LoginController {
    constructor($http, PATHS, LoginService, $ionicLoading, $state, $cordovaOauth) {
        this.$http = $http;
        this.PATHS = PATHS;
        this.LoginService = LoginService;
        this.$ionicLoading = $ionicLoading;
        this.$state = $state;
        this.$cordovaOauth = $cordovaOauth;
        this.params = {};
        this.authenticate = function (provider) {
            this[provider]();
        };
        this.facebook = function () {
            const vm = this;
            // This is the fail callback from the login method
            var fbLoginError = function (error) {
                console.log(error);
                vm.$ionicLoading.hide();
                vm.$state.go('app.profile');
            };
            // This is the success callback from the login method
            var fbLoginSuccess = function (response) {
                vm.$ionicLoading.hide();
                if (!response.authResponse) {
                    fbLoginError('Cannot find the authResponse');
                    return;
                }
                console.log(response);
                setUserApi(response.authResponse);
            };
            var setUserApi = (data) => {
                vm.$http.post(vm.PATHS.api + '/auth', { accessToken: data.accessToken, id: data.userID })
                    .then(function (resp) {
                    vm.LoginService.login(resp.data);
                });
            };
            window.facebookConnectPlugin.getLoginStatus(function (success) {
                if (success.status === 'connected') {
                    // the user is logged in and has authenticated your app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed request, and the time the access token
                    // and signed request each expire
                    console.log(success);
                    vm.$ionicLoading.hide();
                    setUserApi(success.authResponse);
                }
                else {
                    vm.$ionicLoading.show();
                    // ask the permissions you need. You can learn more about FB permissions
                    //  here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                    window.facebookConnectPlugin.login(["public_profile"], fbLoginSuccess, fbLoginError);
                }
            });
        };
        if (LoginService.isAuth()) {
            // User isn’t authenticated
            $state.transitionTo("app.profile");
        }
    }
    twitter() {
        //$state.go('app.profile');
        const vm = this;
        window.TwitterConnect.login(function (result) {
            console.log('Successful login!');
            console.log(result);
            vm.$http.post(vm.PATHS.api + '/auth/twitter/mobile', { id: result.userId, userName: result.userName })
                .then((resp) => {
                vm.LoginService.login(resp.data);
            });
        }, function (error) {
            console.log('Error logging in');
            console.log(error);
        });
        /* this.$cordovaOauth.twitter('Zn0FeVdQOJ6Owo23eiwj2Agil', 'cPUQa4vbj8DELrGT03ssgEphYhDufu9Zf0RU6X4hBQH5nyXdFB').then(function(resp) {
            console.log(resp);
        }); */
        //(<any>window).location = (<any>window).API_URL.replace('/api/v1', '') + '/auth/twitter' ;
    }
    getUserFacebook(authResponse) {
        const vm = this;
        window.FB.api('/me', {
            fields: 'first_name, last_name, email'
        }, function (response) {
            vm.params = response;
            vm.params.accessToken = authResponse.accessToken;
            vm.params.provider = 'facebook';
            vm.$http.post(vm.PATHS.api + '/auth', vm.params).then(function (resp) {
                vm.LoginService.login(resp.data);
            });
        });
    }
}
LoginController.$inject = ['$http', 'PATHS', 'LoginService', '$ionicLoading', '$state'];
exports.LoginController = LoginController;
class AuthTwitterController {
    constructor(User, LoginService, $stateParams) {
        this.User = User;
        this.LoginService = LoginService;
        this.$stateParams = $stateParams;
        let data = {};
        data.user = User.data.user;
        data.token = { token: $stateParams.token };
        if ($stateParams.newuser == 'true') {
            data.newuser = true;
        }
        else {
            data.newuser = false;
            data.state = 'app.home';
        }
        LoginService.login(data);
    }
}
AuthTwitterController.$inject = ['User', 'LoginService', '$stateParams'];
angular.module('Login')
    .controller('LoginController', ['$http', 'PATHS', 'LoginService', '$ionicLoading', '$state', LoginController])
    .controller('AuthTwitterController', ['User', 'LoginService', '$stateParams', AuthTwitterController]);
