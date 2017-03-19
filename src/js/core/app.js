// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordovaOauth', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })
        .state('app.profile', {
            url: '/profile',
            views: {
                'menuContent': {
                    templateUrl: 'templates/profile/profile.html'
                }
            },
            controller: 'ProfileController',
            controllerAs: 'vm'
        })
        .state('app.createMatch', {
            url: '/create-match',
            views: {
                'menuContent': {
                    templateUrl: 'templates/match/create.html'
                }
            }
        })
        .state('app.play', {
            url: '/play',
            views: {
                'menuContent': {
                    templateUrl: 'templates/match/play.html'
                }
            }
        })

    .state('app.search', {
        url: '/search',
        views: {
            'menuContent': {
                templateUrl: 'templates/search.html'
            }
        }
    })

    .state('app.browse', {
            url: '/browse',
            views: {
                'menuContent': {
                    templateUrl: 'templates/browse.html'
                }
            }
        })
        .state('app.playlists', {
            url: '/playlists',
            views: {
                'menuContent': {
                    templateUrl: 'templates/playlists.html',
                    controller: 'PlaylistsCtrl'
                }
            }
        })

    .state('app.single', {
            url: '/playlists/:playlistId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/playlist.html',
                    controller: 'PlaylistCtrl'
                }
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'AppLoginController',
            controllerAs: 'vm'
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});