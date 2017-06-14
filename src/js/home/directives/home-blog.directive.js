angular.module('Home')
    .directive('homeBlog', homeBlog);
function homeBlog() {
    const tplBlog = require('../views/blog.html');
    return {
        template: tplBlog
    };
}
