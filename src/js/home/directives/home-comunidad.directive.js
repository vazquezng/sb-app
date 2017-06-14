angular.module('Home')
    .directive('homeComunidad', homeComunidad);
function homeComunidad() {
    const tplComunidad = require('../views/comunidad.html');
    return {
        template: tplComunidad
    };
}
