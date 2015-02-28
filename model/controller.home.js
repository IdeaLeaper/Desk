App.controller("home",
function(page) {
	
	/* 下拉刷新的简易实现*/
	var el=0;
	$(page).find(".app-content").on("touchmove",function(e){
		if(e.touches[0].pageY>el&&this.scrollTop==0){
			$(page).find(".ref").show();
			$(page).find(".ref").css("height","26px");
			ref();
			setTimeout(function(){
				$(page).find(".ref").hide();
				$(page).find(".ref").css("height","0px");
			},800);
		}
	});
	$(page).find(".app-content").on("touchstart",function(e){
		el=e.touches[0].pageY;
	});

	function ref(p, mode) {
		/* 处理没有指定页码的情况 */
		if (!p) {
			p = 1
		};
		var w = plus.nativeUI.showWaiting("正在获取百科...");
		$.ajax({
			type: 'GET',
			url: 'http://' + localStorage.service + '/api/get_recent_posts/?include=custom_fields,title,excerpt&page=' + p + "&china=" + localStorage.china,
			dataType: 'json',
			cache: false,
			timeout: 20000,
			context: $('body'),
			success: function(data) {
				var compound = "";
				
				/* 组合页面元素 */
				for (var i = 0; i <= data.posts.length -1 ; i++) {
					compound += "<div class='app-section listClick' id=";
					
					/* 根据模式决定, 若刷新则以0开始, 若加载更多则以之前数组长度之后开始 */
					if (mode == 1) {
						compound += i + postarr.posts.length;
					} else {
						compound += i;
					}
					compound += ">";
					if (data.posts[i]["custom_fields"].image) {
						compound += "<div style='float: left;width:50px;height:50px;background:url(\"" + data.posts[i]["custom_fields"].image[0] + "?imageView2/1/w/50/h/50\");background-size:100% 100%;'></div><div style='margin-left:60px;margin-top:-1px;'>";
					}
					compound += "<b>" + without(data.posts[i].title);
					if (data.posts[i]["custom_fields"].image) {
						compound += "&nbsp;&nbsp;<i class='fa fa-picture-o'></i>";
					}
					var wexc = without(data.posts[i].excerpt) + "...";
					var n = wexc.search("继续阅读");
					compound += "</b><br>";
					
					if (n == -1) {
						compound += wexc;
					} else {
						compound += wexc.substr(0, n);
					}
					compound += "</div><div style='clear: both;'></div></div>";
				}

				/* 根据模式来决定是刷新还是加载更多 */
				if (mode == 1) {
					postarr.posts = postarr.posts.concat(data.posts);
					$(page).find(".postsList").html($(page).find(".postsList").html() + compound);
				} else {
					postarr = data;
					$(page).find(".postsList").html(compound);
				}

				/* 注册列表点击事件 */
				$(page).find('.listClick').on("click",
				function() {
					App.load("view", {
						id: this.id,
						obj: postarr
					});
				});
				
				/* 设置状态为已经加载 */
				loaded = true;

				/* 加载更多处理 */
				pN = p;
				$(page).find(".loadmore").hide();
				if (pN < data.pages) {
					$(page).find(".loadmore").show();
				}
				w.close();
			},
			error: function(xhr, type) {
				w.close();
				plus.nativeUI.toast("网络错误");
			}
		});
	}

	$(page).on('appShow',
	function() {
		/* 如果未加载则刷新 */
		if (!loaded) {
			ref();
		}
	});

	$(page).find('.app-button').on("click",
	function() {
		
		/* 注册标题栏右侧功能按钮事件 */
		if (this.id == "new") {
			plus.nativeUI.actionSheet({
				title: "Welcome back, " + localStorage.username + "!",
				cancel: "取消",
				buttons: [{
					title: "发布新百科"
				},
				{
					title: "一图速成"
				},
				{
					title: "我的中心"
				}]
			},
			function(e) {
				if (e.index == 1) {
					/* 载入发布界面 */
					App.load("post");
				} else if (e.index == 3) {
					/* 载入用户中心界面 */
					App.load("center");
				}
			});
			
		/* 注册刷新点击事件 */
		} else if (this.id == "refresh") {
			ref();
			
		/* 注册加载更多点击事件 */
		} else if (this.id == "loadmore") {
			ref(pN + 1, 1);
		}
	});

	/* 注册搜索栏键盘事件 */
	$(page).find(".app-input").on('keydown',
	function() {
		if (event.keyCode == 13) {
			if ($(page).find(".app-input").val().trim() != "") {
				App.load("search", {
					text: $(page).find(".app-input").val().trim()
				});
			}
		}
	});
});