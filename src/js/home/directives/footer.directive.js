angular.module('Home')
    .directive('sbFooter', sbFooter);
function sbFooter() {
    const tplFooter = require('../views/footer.html');
    return {
        template: tplFooter,
        replace: true
    };
}
