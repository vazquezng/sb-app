import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('Feedback');

import './controllers/feedback.controller.ts';
angular
  .module('Feedback')
  .config(['$stateProvider', function($stateProvider){
    const tplFeedback = <string> require('./views/feedback.html');
    $stateProvider.state('app.feedback', {
        url: '/feedback/:match_id/:user_id',
        template: tplFeedback,
        controller: 'FeedbackController',
        controllerAs: 'vm',
        resolve:{
          Load: ['$http', '$state', 'PATHS', '$stateParams', function($http, $state, PATHS, $stateParams){
            return $http.get(PATHS.api + '/feedback/detail/' + $stateParams.match_id + '/' + $stateParams.user_id);
          }]
        }
    });
  }]);