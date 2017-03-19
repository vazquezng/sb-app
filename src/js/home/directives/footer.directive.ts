angular.module('Home')
.directive('sbFooter', sbFooter);

function sbFooter(){
    const tplFooter = <string> require('../views/footer.html');
    return {
        template: tplFooter,
        replace: true
    }
}

