;(function(w,d){
	'use strict';


	//点击搜索按钮
	query('#search').addEventListener('click', function () {
		Blog.toggleSearch();
	}, false);


})(window,document);