import * as angular from 'angular';

function LoginService($state, $rootScope, $http, PATHS){
    let user;

    user = window.localStorage.getItem('user');
    user = user !== null ? JSON.parse(user) : user;
    let vm = this;
    $rootScope.$on('logout', function(){
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        (<any>window).location ='/#!/login';
    });


    this.login = function(data){
        user = data.user;

        console.log('window.localStorage.setItem');
        console.log(localStorage);
        window.localStorage.setItem('token', data.token.token);
        window.localStorage.setItem('user', JSON.stringify(data.user));

        if(window.localStorage.getItem('onesignal-userId')){
          if(data.user.onesignal_app_userId !== window.localStorage.getItem('onesignal-userId')
            || data.user.onesignal_app_pushToken !== window.localStorage.getItem('onesignal-pushToken')){
            const user = data.user;
            user.onesignal_app_userId = window.localStorage.getItem('onesignal-userId');
            user.onesignal_app_pushToken = window.localStorage.getItem('onesignal-pushToken');
            $http.post(PATHS.api + '/user', user).then(function(resp){
                window.localStorage.setItem('user', JSON.stringify(user));
            });
          }
        }

        $rootScope.$broadcast('login');
        $state.go('app.profile');
    }

   this.logout = function(data){
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');

      (<any>window).location ='#!/login';
   }

    this.isAuth =  function(){
        return !(user === null);
    }

    this.getUser = function(){
        return user;
    }

    this.setUser = function(newuser){
        user = newuser;
        window.localStorage.setItem('user', JSON.stringify(newuser));
    }
    //
    if(user){
         $http.get(PATHS.api + '/me').then(function(resp){
             vm.setUser(resp.data.user);
         });
    }
}

angular.module('Login')
        .service('LoginService', ['$state', '$rootScope', '$http','PATHS', LoginService]);
