angular.module('Home')
.directive('homeComunidad', homeComunidad);

function homeComunidad(){
    const tplComunidad = <string> require('../views/comunidad.html');
    return {
        template: tplComunidad
    }
}

