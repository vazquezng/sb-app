var angular = require('angular');
var moment = require('moment');
(<any>window)._ = require('lodash');

import "angular-ui-router";
//import "satellizer";
//import "angular-ui-bootstrap";
import 'angular-google-places-autocomplete';
import 'ng-file-upload';

import 'angularjs-slider';
import 'angular-simple-logger';
import 'angular-google-maps';

import 'angularjs-toaster';

//require('angular-ui-bootstrap/dist/ui-bootstrap-tpls.js');

moment.locale('es');

const NAME = 'ST-WEB';
console.log('llego');
const APP  = {
  NAME: NAME,
  DEPENDENCIES: ['ionic', 'ngCordovaOauth','ui.router', 'google.places', 'ngFileUpload', 'rzModule', 'uiGmapgoogle-maps', 'toaster'],
  ADD_MODULE: function (moduleName:string, dependencies?) {
    angular.module(moduleName, dependencies || []);
    angular.module(NAME).requires.push(moduleName);
  }
};

export {APP};
