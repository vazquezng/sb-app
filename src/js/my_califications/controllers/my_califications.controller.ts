export class MyCalificationsController 
{   
    static $inject = ['$http', '$state', 'PATHS'];

    public feedbacks;

    constructor(private $http, private $state, private PATHS){
        const vm = this;
        vm.$http.get(vm.PATHS.api + '/feedback/califications').then(function(resp){
                vm.feedbacks = resp.data.feedbacks;
            });
    }
}

angular.module('MyCalifications')
        .controller('MyCalificationsController', ['$http', '$state', 'PATHS', MyCalificationsController]);