function UsersService($q, $http) {
    this.facebookSave = function(accessToken) {
        const dfd = $q.defer();

        /*$http.jsonp('http://www.http://api.socialtenis.dev/api/signin/fb/', {
            params: {
                accessToken,
                callback: 'JSON_CALLBACK',
            },
        }).success((response) => {
            localStorage.setItem('config.name', `${response.name} ${response.lastname}`);
            localStorage.setItem('config.avatar', response.avatar);
            dfd.resolve(response);
        }).error(function(err) {
            dfd.resolve({ error: err });
        });*/

        return dfd.promise;
    };
}
UsersService.$inject = ['$q', '$http'];

angular.module('starter.services', [])
    .service('UsersService', UsersService);