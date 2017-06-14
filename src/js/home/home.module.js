"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const angular = require("angular");
require("angular-ui-router");
const config_ts_1 = require("../core/config.ts");
config_ts_1.APP.ADD_MODULE('Home');
require("./controllers/home.controller.ts");
require("./controllers/menu.controller.ts");
require("./directives/welcome.directive.ts");
require("./directives/want-to-play.directive.ts");
require("./directives/sb-sections.directive.ts");
require("./directives/home-blog.directive.ts");
require("./directives/home-comunidad.directive.ts");
require("./directives/footer.directive.ts");
angular
    .module('Home')
    .config(['$stateProvider', function ($stateProvider) {
        const tplApp = require('./views/menu.html');
        //const tplHome = <string> require('./views/home.html');
        $stateProvider
            .state('app', {
            abstact: true,
            template: tplApp,
            controller: 'MenuController',
            controllerAs: 'vm'
        });
        /*.state('app.home', {
            url: '/',
            template: tplHome,
            controller: 'HomeController',
            controllerAs: 'vm'
        });*/
    }]);
