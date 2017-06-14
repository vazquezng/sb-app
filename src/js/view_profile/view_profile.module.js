"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
require("angular-ui-router");
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('Profile', ['Login']);
require("./controllers/view_profile.controller.ts");
angular
    .module('Profile')
    .config(['$stateProvider', function ($stateProvider) {
        // const tplAppProfile = <string> require('../../templates/profile/view_profile.html');
        $stateProvider.state('app.profile', {
            cache: true,
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
                Availability: ['$http', 'PATHS', '$ionicLoading', function ($http, PATHS, $ionicLoading) {
                        return $http.post(PATHS.api + '/user/retrieveUserAvailability');
                    }],
            },
            authenticate: true,
        });
    }]);
angular
    .module('Profile').directive('file', function () {
    return {
        require: "ngModel",
        restrict: 'A',
        link: function ($scope, el, attrs, ngModel) {
            el.bind('change', function (event) {
                var files = event.target.files;
                var file = files[0];
                ngModel.$setViewValue(file);
                $scope.$apply();
            });
        }
    };
});
