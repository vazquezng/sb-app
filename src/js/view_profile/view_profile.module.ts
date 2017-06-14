import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('Profile',['Login']);

import './controllers/view_profile.controller.ts';
angular
  .module('Profile')
  .config(['$stateProvider', function($stateProvider){
    // const tplAppProfile = <string> require('../../templates/profile/view_profile.html');
    $stateProvider.state('app.profile', {
        cache: false,
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: './templates/profile/view_profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm'
            }
        },
        authenticate: true,
    })
    .state('app.profile-availability', {
        cache: false,
        url: '/profile/availability',
        views: {
            'menuContent': {
                templateUrl: './templates/profile/view_profile_availability.html',
                controller: 'ProfileAvailabilityController',
                controllerAs: 'vm'
            }
        },
        resolve: {
            Availability: ['$http', 'PATHS', '$ionicLoading', function($http, PATHS, $ionicLoading){
                return $http.post(PATHS.api + '/user/retrieveUserAvailability');
            }],
        },
        authenticate: true,
    });
  }]);

angular
  .module('Profile').directive('file', function() {
  return {
        require:"ngModel",
        restrict: 'A',
        link: function($scope, el, attrs, ngModel){
            el.bind('change', function(event){
                var files = (<any>event).target.files;
                var file = files[0];

                (<any>ngModel).$setViewValue(file);
                $scope.$apply();
            });
        }
    };
});
