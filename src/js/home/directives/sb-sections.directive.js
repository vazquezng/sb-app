angular.module('Home')
    .directive('sbSections', sbSections);
function sbSections() {
    const tpl = require('../views/sb-sections.html');
    return {
        template: tpl
    };
}
