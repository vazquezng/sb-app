angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', function($scope, $ionicModal, $timeout) {


    }])
    .controller('PlaylistsCtrl', function($scope) {
        $scope.playlists = [
            { title: 'Reggae', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })
    .controller('PlaylistCtrl', function($scope, $stateParams) {})
    .controller('AppLoginController', ['$state', '$ionicLoading', 'UsersService', '$cordovaOauth', function($state, $ionicLoading, UsersService, $cordovaOauth) {
        var vm = this;



        vm.facebookSignIn = function() {
            window.facebookConnectPlugin.getLoginStatus(function(success) {
                if (success.status === 'connected') {
                    // the user is logged in and has authenticated your app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed request, and the time the access token
                    // and signed request each expire

                    /* UsersService.facebookSave(success.authResponse.accessToken).then((res) => {
                         localStorage.setItem('config.mail', res.mail);
                         // se loguea con fb automaticamente.

                         $ionicLoading.hide();
                         $state.go('profile');
                     }, fbLoginError);*/
                    console.log(success);
                    $ionicLoading.hide();
                    $state.go('app.profile');
                } else {
                    $ionicLoading.show();

                    // ask the permissions you need. You can learn more about FB permissions
                    //  here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                    window.facebookConnectPlugin.login(['email', 'public_profile', 'user_friends'], fbLoginSuccess, fbLoginError);
                }
            });
        };

        vm.twitterSignIn = function() {
            $state.go('app.profile');
            $cordovaOauth.twitter('Zn0FeVdQOJ6Owo23eiwj2Agil', 'cPUQa4vbj8DELrGT03ssgEphYhDufu9Zf0RU6X4hBQH5nyXdFB').then(function(resp) {
                console.log(resp);
            });
        };
    }])
    .controller('ProfileController', ['$state', function($state) {
        var vm = this;
    }]);