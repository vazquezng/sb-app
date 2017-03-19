import * as angular from 'angular';
import "angular-ui-router";
import { APP } from '../core/config.ts';

APP.ADD_MODULE('MatchDetail');

import './controllers/match_detail.controller.ts';
angular
  .module('MatchDetail')
  .config(['$stateProvider', function($stateProvider){
    const tplMatchDetail = <string> require('./views/match_detail.html');
    $stateProvider.state('app.match_detail', {
        url: '/match_detail/:id',
        template: tplMatchDetail,
        controller: 'MatchDetailController',
        controllerAs: 'vm'
    });
  }]);