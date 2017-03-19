import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('Profile',['Login']);

import './controllers/view_profile.controller.ts';
angular
  .module('Profile')
  .config(['$stateProvider', function($stateProvider){
    const tplAppProfile = <string> require('../../templates/profile/view_profile.html');
    $stateProvider.state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: './templates/profile/view_profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm'
            }
        }
        
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