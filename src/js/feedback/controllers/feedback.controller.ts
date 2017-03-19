export class FeedbackController 
{   
    static $inject = ['Load','$http', '$state', 'PATHS', '$stateParams'];

    public match;
    public user;
    public feedback;

    constructor(private Load, private $http, private $state, private PATHS, $stateParams){
        const vm = this;
        vm.match = Load.data.match;
        vm.user = Load.data.user;
    }

    public saveFeedback(){
        const vm = this;
        
        if(!vm.feedback){
            return;
        }
        
        vm.feedback.id_user_to = vm.user.id;
        vm.feedback.id_match = vm.match.id;
        console.log(vm.feedback);
        this.$http.post(this.PATHS.api + '/feedback/save', vm.feedback).then(function(resp){
            if(resp.data.success){
                vm.$state.go('app.home');
            }
        });
    }

    
}

angular.module('Feedback')
        .controller('FeedbackController', ['Load', '$http', '$state', 'PATHS', '$stateParams', FeedbackController]);