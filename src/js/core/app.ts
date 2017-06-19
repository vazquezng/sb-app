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
    .run(['$rootScope','$state', '$window', '$ionicPlatform', '$ionicLoading', 'LoginService', 'toaster', '$ionicHistory', '$ionicPopup',
      function($rootScope, $state, $window, $ionicPlatform, $ionicLoading, LoginService, toaster, $ionicHistory, $ionicPopup){
        //If the route change failed due to authentication error, redirect them out
        $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
            if(rejection === 'Not Authenticated'){
                $state.go('login');
            }
        });
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams,
          fromState, fromParams) {
          if (toState.authenticate && !LoginService.isAuth()) {
            // User isn’t authenticated
            $state.transitionTo("login");
            event.preventDefault();
          }
        });
        $rootScope.$on('$stateChangeSuccess', function(/*event, toState, toParams, fromState, fromParams*/) {
          // display new view from top
          $window.scrollTo(0, 0);
        });
        $rootScope.$on('$stateChangeStart',
        function(){
          $ionicLoading.show({
            template: `<ion-spinner class="tc-spinner"></ion-spinner>`,
            hideOnStateChange: true,
            showBackdrop: true,
          });
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

            const back = function (){
              // Logica flecha back. Recorro el historial de más reciente a menos.
              let views = $ionicHistory.viewHistory().views;
              let viewsArr = Object.keys(views).map(key => views[key]);

              let lastView = null;

              for (let i = viewsArr.length - 1; i >= 0; i--) {
                lastView = viewsArr[i] || null;
                if (!lastView) {
                  $state.go('app.profile', {}, {replace: true});
                  return;
                }

                if (lastView.stateName !== 'login') {
                  $state.go(lastView.stateName, lastView.stateParams, {replace: true});
                  return;
                }
              }
              $state.go('app.profile', {}, {replace: true});
            };
            /*
            document.addEventListener('backbutton', function (event) {
              event.preventDefault();
              event.stopPropagation();
              console.log($ionicHistory);
              back();
            }, false); */

            $ionicPlatform.registerBackButtonAction(function (event) {
              if($state.current.name=="app.profile"){
                $ionicPopup.confirm({
                  title: 'Slambow',
                  template: 'Desea salir de la aplicación?',
                }).then(function(res) {
                  if (res) {
                    (<any>navigator).app.exitApp();
                  }
                });
              }else {
                (<any>navigator).app.backHistory();
                // const $backView = $ionicHistory.backView();
                // $backView.go();
              }
            }, 100);
            // Enable to debug issues.
            // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

            var notificationOpenedCallback = function(jsonData) {
              console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
              if(jsonData.section){
                $state.go(jsonData.section, {id: jsonData.id})
              }
            };

            try{
               // Set your iOS Settings
              const iosSettings = {};
              iosSettings["kOSSettingsKeyAutoPrompt"] = true;
              iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
              (<any>window).plugins.OneSignal
                .startInit("04ca6438-f5a3-4af1-932b-e64b777b5216")
                .iOSSettings(iosSettings)
                .handleNotificationReceived(notificationOpenedCallback)
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

              (<any>window).plugins.OneSignal.getIds(function(ids) {
                  console.log('getIds: ' + JSON.stringify(ids));
                  window.localStorage.setItem('onesignal-userId', ids.userId);
                  window.localStorage.setItem('onesignal-pushToken', ids.pushToken);
                })

              // Call syncHashedEmail anywhere in your app if you have the user's email.
              // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
              // window.plugins.OneSignal.syncHashedEmail(userEmail);
            }catch(e){
              console.log(e);
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
