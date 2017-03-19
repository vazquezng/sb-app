angular.module('Home')
    .directive('wantToPlay', wantToPlay);

function wantToPlay(){
    const tpl = <string> require('../views/want-to-play.html');
    return {
        template: tpl
    }
}