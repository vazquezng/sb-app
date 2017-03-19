export class FriendsController 
{   
    static $inject = ['Friends', '$scope', '$http', 'PATHS'];

    public users;
    constructor(private Friends, private $scope, private $http, private PATHS){
        const vm = this;
        this.users = Friends.data.users;
    }
}

angular.module('Friends')
        .controller('FriendsController', ['Friends', '$scope', '$http', 'PATHS', FriendsController]);
