export class MyCalificationsController 
{   
    static $inject = ['Califications', '$state'];

    public feedbacks;

    constructor(private Califications, private $state){
        const vm = this;
        this.feedbacks = Califications.data.feedbacks;
    }
}

angular.module('MyCalifications')
        .controller('MyCalificationsController', [ 'Califications', '$state', MyCalificationsController]);