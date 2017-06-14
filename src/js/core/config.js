"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require('angular');
var moment = require('moment');
window._ = require('lodash');
require("angular-ui-router");
//import "satellizer";
//import "angular-ui-bootstrap";
require("angular-google-places-autocomplete");
require("ng-file-upload");
require("angularjs-slider");
require("angular-simple-logger");
require("angular-google-maps");
require("angularjs-toaster");
//require('angular-ui-bootstrap/dist/ui-bootstrap-tpls.js');
moment.locale('es');
const NAME = 'ST-WEB';
console.log('llego');
const APP = {
    NAME: NAME,
    DEPENDENCIES: ['ionic', 'ui.router', 'google.places', 'ngFileUpload', 'rzModule', 'uiGmapgoogle-maps', 'toaster'],
    ADD_MODULE: function (moduleName, dependencies) {
        angular.module(moduleName, dependencies || []);
        angular.module(NAME).requires.push(moduleName);
    }
};
exports.APP = APP;
