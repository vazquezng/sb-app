export class HomeController 
{   
    static $inject = [];
    constructor(){
    }
}

angular.module('Home')
        .controller('HomeController', [HomeController]);