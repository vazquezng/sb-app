import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('MyCalifications');

import './controllers/my_califications.controller.ts';

angular
  .module('MyCalifications')
  .config(['$stateProvider', function($stateProvider){
    const tplMyCalifications = <string> require('./views/my_califications.html');
    $stateProvider
    .state('app.myCalifications', {
        url: '/my_califications',
        template: tplMyCalifications,
        controller: 'MyCalificationsController',
        controllerAs: 'vm'
    });
  }]);