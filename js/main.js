;(function(w,d){
	'use strict';
	var body = d.body,
	query = d.querySelector.bind(d),
	queryAll = d.querySelectorAll.bind(d),
	root = query('html'),
	menu = query('#menu'),
	header = query('#header'),
	mask = query('#mask'),
	loading = query('#loading'),
	menuOpen = query('#menu-open'),
	menuOff = query('#menu-off'),
	gotop = query('#gotop'),
	animate = w.requestAnimationFrame,
	scrollSpeed = 20,
	forEach = Array.prototype.forEach,
	even = ('ontouchstart' in w && /Mobile|android|iOS|iPhone|iPad|Windows Phone|KEAPWI/i.test(navigator.userAgent)) ? 'touchstart' : 'click',
	isWX = /micromessenger/i.test(navigator.userAgent),
	noop = function () {},
	docEl = d.documentElement;
	var Blog = {
		//关闭显示侧边栏
		toggleMenu : function (flag) {
			var main = query('#main');
			if (flag) {
				menu.classList.remove('hide');
				if (w.innerWidth < 1241 ) {
					menu.classList.add('show');
					mask.classList.add('in');
					root.classList.add('lock');
				}
			}else{
				menu.classList.remove('show');
				mask.classList.remove('in');
				root.classList.remove('lock');
			}
		},
		//遮罩层
		hideOnMask : [],
		model :function (target) {
			this._model = query(target);
			this._off = this._model.querySelector('.close');

			var self = this;
			this.show = function () {
				mask.classList.add('in');
				self._model.classList.add('ready');
				setTimeout(function () {
					self._model.classList.add('in');
				}, 20);
			}
			this.hide = function () {
				mask.classList.remove('in');
				self._model.classList.remove('ready');
				setTimeout(function () {
					self._model.classList.remove('in');
				}, 20);
			}
			this.toggle = function () {
				return self._model.classList.contains('in') ? self.hide() : self.show();
			}
			Blog.hideOnMask.push(this.hide);
			this._off && this._off.addEventListener(even,  self.hide());

		},

	}

	//页面加载完成后
	w.addEventListener('load', function () {
		// Blog.toggleMenu(true);
		loading.classList.remove('active');
		var top = docEl.scrollTop;

	}, false);


	//页面滚动时
	w.addEventListener('scroll', function () {
		var BarOffsetTop = outils.getScrollTop();
		var headerTop = header.clientHeight;

		if (BarOffsetTop > headerTop) {
			header.classList.add('fixed');
		}else{
			header.classList.remove('fixed');
		}

		setTimeout(function () {
			if (BarOffsetTop < 600) {
				gotop.classList.remove('in');

			}else{
				gotop.classList.add('in');
			}
		}, 300);

	}, false);

	//页面缩放
	w.addEventListener('resize', function () {
		Blog.toggleMenu();
	}, false);

	//打开侧边栏
	menuOpen.addEventListener(even, function (e) {
		Blog.toggleMenu(true);
		e.preventDefault();
	}, false);

	//关闭侧边栏
	menuOff.addEventListener(even, function (e) {
		menu.classList.add('hide');
		e.preventDefault();
	}, false);

	mask.addEventListener(even, function (e) {
		Blog.toggleMenu();
		e.preventDefault();
	}, false);



	//返回顶部
	gotop.addEventListener('click', function () {
		outils.scrollTo(0, 300);
	}, false);






})(window,document);