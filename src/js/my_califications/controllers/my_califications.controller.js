"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MyCalificationsController {
    constructor(Califications, $state) {
        this.Califications = Califications;
        this.$state = $state;
        const vm = this;
        this.feedbacks = Califications.data.feedbacks;
    }
}
MyCalificationsController.$inject = ['Califications', '$state'];
exports.MyCalificationsController = MyCalificationsController;
angular.module('MyCalifications')
    .controller('MyCalificationsController', ['Califications', '$state', MyCalificationsController]);
