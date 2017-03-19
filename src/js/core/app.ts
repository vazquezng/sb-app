import angular = require('angular');
import { APP } from './config.ts';


(<any>window).DEV = true;
//Start by defining the main module and adding the module dependencies
angular.module(APP.NAME, APP.DEPENDENCIES)
.constant('PATHS', {
        api: (<any>window).API_URL
    })
    .config(['$httpProvider', '$locationProvider', '$urlRouterProvider',
    function($httpProvider, $locationProvider, $urlRouterProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        //$locationProvider.html5Mode(true).hashPrefix('*');
        console.log('/login');
        $urlRouterProvider.otherwise('/profile');
    }])
    .config(['$httpProvider', function($httpProvider){
      $httpProvider.interceptors.push(['$q', '$location', '$rootScope', function ($q, $location, $rootScope) {
          return {
              'request': function (config) {
                  config.headers = config.headers || {};
                  if ( window.localStorage.getItem('token')){
                      config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('token');
                  }
                  return config;
              },
              'responseError': function (response) {
                  if (response.status === 401 || response.status === 403) {
                      $rootScope.$broadcast('logout');
                  }
                  return $q.reject(response);
              }
          };
      }]);

      $httpProvider.defaults.headers.patch = {
          'Content-Type': 'application/json;charset=utf-8'
      };
    }])
    .config(['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            argentina: true
        });
    }])
    .run(['$rootScope','$state', '$window', '$ionicPlatform', function($rootScope, $state, $window, $ionicPlatform){
        //If the route change failed due to authentication error, redirect them out
        $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
            if(rejection === 'Not Authenticated'){
                $state.go('login');
            }
        });
        $rootScope.$on('$stateChangeSuccess', function(/*event, toState, toParams, fromState, fromParams*/) {
          // display new view from top
          $window.scrollTo(0, 0);
        });

        $rootScope.URL_BUCKET = (<any>window).URL_BUCKET;

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if ((<any>window).cordova && (<any>window).cordova.plugins.Keyboard) {
                (<any>window).cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                (<any>window).cordova.plugins.Keyboard.disableScroll(true);

            }
            if ((<any>window).StatusBar) {
                // org.apache.cordova.statusbar required
                (<any>window).StatusBar.styleDefault();
            }
        });
    }]);

if (!(<any>window).DEV) {
  angular.module(APP.NAME).config(['$compileProvider', function($compileProvider){
    $compileProvider.debugInfoEnabled(false);
  }]);
}

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }

  //Then init the app
  angular.bootstrap(document, [APP.NAME], {
    strictDi: true
  });
});
