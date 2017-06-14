angular.module('Home')
    .directive('welcome', welcome);
function welcome() {
    const tpl = require('../views/welcome.html');
    return {
        template: tpl
    };
}
