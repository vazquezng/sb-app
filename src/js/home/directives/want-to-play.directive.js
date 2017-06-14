angular.module('Home')
    .directive('wantToPlay', wantToPlay);
function wantToPlay() {
    const tpl = require('../views/want-to-play.html');
    return {
        template: tpl
    };
}
