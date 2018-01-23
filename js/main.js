;(function(w,d){
	'use strict';
	var body = d.body,
	query = d.querySelector.bind(d),
	queryAll = d.querySelectorAll.bind(d),
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
	noop = function () {};
	var Blog = {
		//关闭显示侧边栏
		toggleMenu: function (flag) {
			var main = query('#main');
			if (flag) {
				menu.classList.remove('hide');
				if (w.innerWidth < 1241 ) {
					body.classList.add('lock');
					menu.classList.add('show');
					mask.classList.add('in');
				}
			}else{
				body.classList.remove('lock');
				menu.classList.remove('show');
				mask.classList.remove('in');
			}
		},
		//遮罩层
		hideOnMask : [],
		model: function (target) {
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
			this.onHide = noop;
			this.hide = function () {
				self.onHide();
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
			this._off && this._off.addEventListener(even, self.hide);

		},
		//页面动画处理
		page: (function () {
			var elms = queryAll('.fade, .fade-scale');
			return {
				loaded: function () {
					forEach.call(elms, function (el) {
						el.classList.add('in');
					})
				},
				unload: function () {
					forEach.call(elms, function (el) {
						el.classList.remove('in');
					})
				}

			}

		})(),
		tabBar: function (el) {
			el.parentNode.parentNode.classList.toggle('expand')
		},
		//分享
		share: function () {
			//顶部菜单分享
			var menuShare = query('#menuShare');
			var globalShare = query('#globalShare');
			var shareModal = new this.model('#globalShare');
			menuShare.addEventListener(even, shareModal.toggle);

			//文章分享
			var pageShareBtn = query('#pageShareBtn');
			var articleShare = query('#article-share');
			if (pageShareBtn) {
				pageShareBtn.addEventListener(even, function (e) {
					articleShare.classList.toggle('in');
				}, false)

				d.addEventListener(even, function (e) {
					!pageShareBtn.contains(e.target) && articleShare.classList.remove('in');
				}, false)
			}
		},
		//打赏
		reward: function () {
			var model = new this.model('#rewardModel');
			query('#rewardBtn').addEventListener(even, model.toggle);
		},

	}

	//页面加载完成后
	w.addEventListener('load', function () {
		loading.classList.remove('active');
		Blog.page.loaded();
	}, false);

	//离开页面前
	w.addEventListener('beforeunload', function () {
		Blog.page.unload();
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

	//关闭遮罩
	mask.addEventListener(even, function (e) {
		Blog.toggleMenu();
		Blog.hideOnMask.forEach(function (hide) {
			hide()
		});
		e.preventDefault();
	}, false);

	//返回顶部
	gotop.addEventListener('click', function () {
		outils.scrollTo(0, 300);
	}, false);
	var tabBar =  query('#tabBar');
	var tabsWarp =  query('#tabsWarp');
	tabBar && tabBar.addEventListener('click', function (e) {
			tabsWarp.classList.toggle('in')
	}, false);


	if (w.BLOG.SHARE) {
		Blog.share();
	}

	if (w.BLOG.REWARD) {
		Blog.reward();
	}


	console.log("%c  Copyright By 黑夜 感谢你的来访！", "background-image:-webkit-gradient( linear, left top,right top, color-stop(0, #00a419),color-stop(0.15, #f44336), color-stop(0.29, #ff4300),color-stop(0.3, #AA00FF),color-stop(0.4, #8BC34A), color-stop(0.45, #607D8B),color-stop(0.6, #4096EE), color-stop(0.75, #D50000),color-stop(0.9, #4096EE), color-stop(1, #FF1A00));color:transparent;-webkit-background-clip:text;font-size:13px;");

})(window,document);