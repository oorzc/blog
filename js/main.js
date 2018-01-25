;(function(w,d){
	'use strict';
	var body = d.body,
	query = d.querySelector.bind(d),
	queryAll = d.querySelectorAll.bind(d),
	html = query('html'),
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
	var tabsWarp = query('#tabsWarp');
	var Blog = {
		//关闭显示侧边栏
		toggleMenu: function (flag) {
			tabsWarp && tabsWarp.classList.remove('fixed');
			if (flag) {
				menu.classList.remove('hide');
				if (w.innerWidth < 1241 ) {
					html.classList.add('lock');
					menu.classList.add('show');
					mask.classList.add('in');
				}
			}else{
				html.classList.remove('lock');
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
		//标签切换
		tabBar: function () {
			var tabMore =  query('#tabMore');
			tabMore && tabMore.addEventListener('click', function (e) {
				tabsWarp.classList.toggle('ready');
				setTimeout(function () {
					tabsWarp.classList.toggle('in');
				}, 300);
			}, false);

			d.addEventListener('click', function (e) {
				!tabsWarp.contains(e.target) && tabsWarp.classList.remove("ready", "in");
			}, false);
		},
		//固定导航标签
		fixedTabBar: function (flag) {
			//滚动条滚动距离
			var BarOffsetTop = outils.getScrollTop();
			if (!tabsWarp) {
				return false;
			}

			var articleListWarp = query('.article-list');
			//导航标签到头部的距离
			var tabScrollTop = tabsWarp.offsetTop - header.offsetTop;

			if (BarOffsetTop > tabScrollTop) {
				tabsWarp.classList.add('fixed');
				if (w.innerWidth < 960 ) {
					tabsWarp.style.left  = 0;
					tabsWarp.style.width  = '100%';
				}else{
					tabsWarp.style.left = articleListWarp.offsetLeft+'px';
					tabsWarp.style.width  = articleListWarp.offsetWidth+'px';
				}
				w.addEventListener('resize', function () {
					tabsWarp.classList.remove('fixed');
				}, false);
			}else{
				tabsWarp.style.left  = 0;
				tabsWarp.classList.remove('fixed');
			}
		},
		//分享
		share: function () {
			//顶部菜单分享
			var menuShare = query('#menuShare');
			var shareModal = new this.model('#globalShare');
			menuShare.addEventListener(even, shareModal.toggle);

			//文章分享
			var pageShareBtn = query('#pageShareBtn');
			var articleShare = query('#articleShare');
			if (pageShareBtn) {
				pageShareBtn.addEventListener(even, function (e) {
					articleShare.classList.toggle('in');
				}, false);

				d.addEventListener(even, function (e) {
					!pageShareBtn.contains(e.target) && articleShare.classList.remove('in');
				}, false);
			}

			//微信分享
			var wxShareBtn = queryAll('.wxShareBtn');
			var wxShareModel = new this.model('#wxShareWarp');
			wxShareModel.onHide = shareModal.hide;
			// wxShareBtn.forEach( function(element, index) {
			// 	element.addEventListener(even, wxShareModel.toggle)
			// });

			forEach.call(wxShareBtn, function (el) {
				el.addEventListener(even, wxShareModel.toggle)
			})
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
		//滚动条滚动距离
		var BarOffsetTop = outils.getScrollTop();
		//顶部导航高度
		var headerTop = header.clientHeight;

		//顶部添加阴影
		if (BarOffsetTop > headerTop) {
			header.classList.add('fixed');
		}else{
			header.classList.remove('fixed');
		}

		//导航栏处理
		Blog.fixedTabBar();

		//显示隐藏滚动条
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
		Blog.hideOnMask.forEach(function (hide) {
			hide();
		});
	}, false);

	//打开侧边栏
	menuOpen.addEventListener(even, function (e) {
		Blog.toggleMenu(true);
		e.preventDefault();
	}, false);

	//关闭侧边栏
	menuOff.addEventListener(even, function () {
		menu.classList.add('hide');
		//隐藏标签
		tabsWarp && tabsWarp.classList.remove('fixed');
	}, false);

	//关闭遮罩
	mask.addEventListener(even, function (e) {
		Blog.toggleMenu();
		Blog.hideOnMask.forEach(function (hide) {
			hide();
		});
		e.preventDefault();
	}, false);

	//返回顶部
	gotop.addEventListener('click', function () {
		outils.scrollTo(0, 300);
	}, false);



	if (w.BLOG.SHARE) {
		Blog.share();
	}

	if (w.BLOG.REWARD) {
		Blog.reward();
	}

	if (w.BLOG.TABBAR) {
		Blog.tabBar();
	}

	if (w.Waves) {
		Waves.init();
		Waves.attach('.waves-btn', ['waves-light', 'waves-button', 'waves-effect']);
		Waves.attach('.waves-circle-btn', ['waves-light', 'waves-circle', 'waves-effect']);
	} else {
		console.error('Waves loading failed.');
	}

	//检测 hljs 是否为对象
	if (typeof hljs === 'object') {
		hljs.initHighlightingOnLoad();
		Array.prototype.slice.call(document.querySelectorAll('pre')).forEach(function(block) {
			hljs.highlightBlock(block);
		});
	}

	//生成二维码
	var qrcode = new QRCode(document.getElementById("qrcode"), {
		width : 250,
		height : 250
	});
	qrcode.makeCode(window.location.href);
	return w.Blog = Blog;
	console.log("%c  Copyright By 黑夜 感谢你的来访！", "background-image:-webkit-gradient( linear, left top,right top, color-stop(0, #00a419),color-stop(0.15, #f44336), color-stop(0.29, #ff4300),color-stop(0.3, #AA00FF),color-stop(0.4, #8BC34A), color-stop(0.45, #607D8B),color-stop(0.6, #4096EE), color-stop(0.75, #D50000),color-stop(0.9, #4096EE), color-stop(1, #FF1A00));color:transparent;-webkit-background-clip:text;font-size:13px;");

})(window,document);