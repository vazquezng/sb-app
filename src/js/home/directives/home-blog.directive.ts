angular.module('Home')
.directive('homeBlog', homeBlog);

function homeBlog(){
    const tplBlog = <string> require('../views/blog.html');
    return {
        template: tplBlog
    }
}

