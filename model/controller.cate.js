App.controller("cate",
function(page) {
	function ref(p, mode) {
		/* 处理没有指定页码的情况 */
		if (!p) {
			p = 1
		};
		var w = plus.nativeUI.showWaiting("正在获取百科...");
		$.ajax({
			type: 'GET',
			url: 'http://' + localStorage.service + '/api/get_category_posts/?include=custom_fields,title,excerpt&page=' + p + "&china=" + localStorage.china + "&slug=" + $(page).find(".w-cate").val(),
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
						compound += i + searcharr.posts.length;
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
				
				/* 处理未找到的情况 */
				if(data.posts.length==0){
					compound="<div class='app-section'>未找到相关内容</div>";
				}
				
				/* 根据模式来决定是刷新还是加载更多 */
				if (mode == 1) {
					searcharr.posts = searcharr.posts.concat(data.posts);
					$(page).find(".postsList").html($(page).find(".postsList").html() + compound);
				} else {
					searcharr = data;
					$(page).find(".postsList").html(compound);
				}
				
				/* 注册列表点击事件 */
				$(page).find('.listClick').on("click",
				function() {
					App.load("view", {
						id: this.id,
						obj: searcharr
					});
				});
				
				/* 设置状态为已经加载 */
				loaded = true;

				
				/* 加载更多处理 */
				spN = p;
				$(page).find(".loadmore").hide();
				if (spN < data.pages) {
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

	$(page).find('.app-button').on("click",
	function() {
		/* 注册加载更多点击事件 */
		if (this.id == "loadmore") {
			ref(spN + 1, 1);
		}
	});
	
	ref();
	
	$(page).find(".w-cate").on("change",function(){
		ref();
	})

});