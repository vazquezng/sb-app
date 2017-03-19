angular.module('Home')
    .directive('welcome', welcome);


function welcome(){
    const tpl = <string> require('../views/welcome.html');
    return {
        template: tpl
    }
}