;(function(w,d){
	'use strict';
	var body = d.body,
	query = d.querySelector.bind(d),
	queryAll = d.querySelectorAll.bind(d),
	searchBtn = query('#search'),
	contentBox = query('#contentBox'),
	searchWrap = query('#search-warp'),
	keyInput = query('#key'),
	searchBack = query('#search-back'),
	searchPanel = query('#search-panel'),
	searchResult = query('#search-result'),
	searchTpl = query('#search-tpl').innerHTML,
	even = ('ontouchstart' in w && /Mobile|android|iOS|iPhone|iPad|Windows Phone|KEAPWI/i.test(navigator.userAgent)) ? 'touchstart' : 'click';

	//空操作
	var noop = function () {};

	//获取数据
	function loadData(result) {
		ajax({
			type:'get',
			url:'content.json',
			success:function(res){
				result(res)
			}
		});
	}

	//模板数据填充
	function tpl (html, data) {
		return html.replace(/\{\w+\}/g, function (str) {
			var prop = str.replace(/\{|\}/g, '');
			return data[prop] || '';
		});
	}

	var Control = {
		show: function () {
			w.innerWidth < 760 ? body.classList.add('lock') : noop;
			searchPanel.classList.add('in');
		},
		hide: function () {
			w.innerWidth < 760 ? body.classList.remove('lock') : noop;
			searchPanel.classList.remove('in');
		}
	}

	//数据渲染
	function render (data) {
		// console.log(data);
		var html = '';
		if (data.length) {
			html = data.map(function (post) {
				// console.log(post)
				return tpl(searchTpl, {
					title: post.title,
					path: ( '/' + post.path).replace(/\/{2}/g, '/'),
					date: format(post.date),
					tags: post.tags.map(function (tag) {
						return '<span>#' + tag.name + '</span>';
					}).join('')
				});
			}).join('');
		} else {
			html = '<li class="tips"><i class="iconfont icon-fly"></i><p>未找到搜索结果，请重新输入！</p></li>';
		}
		searchResult.innerHTML = html;
	}

	function format(str) {
		var time;
		var date = new Date(str);
		var  year = date.getFullYear();
		var  month = date.getMonth() - 1 < 9 ? '0' + date.getMonth() : date.getMonth();
		var day = date.getDate() < 9 ? '0' + date.getDate() : date.getDate();
		time = year + '/' + month + '/' + day;
		return time;

	}

	function regtest(raw, regExp) {
		regExp.lastIndex = 0;
		return regExp.test(raw);
	}

	function matcher(post, regExp) {
		return regtest(post.title, regExp) || post.tags.some(function (tag) {
			return regtest(tag.name, regExp);
		}) || regtest(post.text, regExp);
	}

	function search(e) {
		var key = this.value.trim();
		if (!key) {
			Control.hide();
			return;
		}
		var regExp = new RegExp(key.replace(/[ ]/g, '|'), 'gmi');
		loadData(function (result) {
			var data = JSON.parse(result);
			var result = data.filter(function (post) {
				return matcher(post, regExp);
			});
			render(result);
			Control.show();
		});
		e.preventDefault();
	}

	//点击搜索按钮, 显示隐藏搜索框
	searchBtn.addEventListener('click', function () {
		searchWrap.classList.toggle('in');
		contentBox && contentBox.classList.toggle('hide');
		query('html').classList.toggle('lock');
		keyInput.value = '';
		searchWrap.classList.contains('in') ? keyInput.focus() : keyInput.blur();
		Control.hide();
	}, false);

	//返回按钮
	searchBack.addEventListener(even, function () {
		searchWrap.classList.remove('in');
		contentBox && contentBox.classList.remove('hide');
		query('html').classList.remove('lock');
		Control.hide();
	}, false);

	d.addEventListener(even, function (e) {
		if (e.target.id !== 'key' && e.target.id !== 'search-panel' && e.target.tagName !== 'LI' && even === 'click') {
			Control.hide();
		}
	},false);

	keyInput.addEventListener('input', search);
	keyInput.addEventListener(even, search);

})(window,document);