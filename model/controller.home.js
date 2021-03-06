App.controller("home",
function(page) {
	
	/* 下拉刷新的简易实现*/
	var el=0;
	$(page).find(".app-content").on("touchmove",function(e){
		if(e.touches[0].pageY>el&&this.scrollTop==0){
			$(page).find(".ref").show();
			$(page).find(".ref").height("26px");
			$(page).find(".refok").height("26px");
			ref(1,0,2);
		}
	});
	$(page).find(".app-content").on("touchstart",function(e){
		el=e.touches[0].pageY;
	});

	function ref(p, mode, src) {
		/* 处理没有指定页码的情况 */
		if (!p) {
			p = 1
		};
		if(!src){
			var w = plus.nativeUI.showWaiting("正在获取百科...");
		}else if(src==1){
			$(page).find(".loadmore").html('<i class="fa fa-spinner fa-lg"></i>&nbsp;&nbsp;正在加载');
			loadingmore=true;
		}
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
					
					var excerpt = without(data.posts[i].excerpt) + "...";
					var n = excerpt.search("继续阅读");
					
					if (n != -1) {
						excerpt=excerpt.substr(0, n);
					}
					
					var title=without(data.posts[i].title);
					
					if (mode == 1) {
						var id = i + postarr.posts.length;
					} else {
						var id = i;
					}
					
					if (data.posts[i]["custom_fields"].image) {
						var img=data.posts[i]["custom_fields"].image[0] + "?imageView2/1/w/"+$(window).width()+"/h/180";
						compound+='<div class="card listClick" id='+id+'>'
						+'<div class="card-img">'
						+'<img src="'+img+'" />'
						+'<div class="card-img-title">'+title+'</div>'
						+'</div>'
						+'<div class="card-content">'+excerpt+'</div>'
						+'</div>';
					}else{
						compound+='<div class="card listClick" id='+id+'>'
						+'<div class="card-title">'+title+'</div>'
						+'<div class="card-content">'+excerpt+'</div>'
						+'</div>';
					}
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
				$(page).find('.listClick').clickable();
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
				
				if(!src){
					w.close();
				}else if(src==1){
					$(page).find(".loadmore").html('<i class="fa fa-chevron-circle-down fa-lg"></i>&nbsp;&nbsp;加载更多');
					loadingmore=false;
				}else if(src==2){
					$(page).find(".ref").hide();
					$(page).find(".ref").height("0px");
					$(page).find(".refok").show();
					setTimeout(function(){
						$(page).find(".refok").height("0px");
						setTimeout(function(){$(page).find(".refok").hide();},200);
					},800);
				}
			},
			error: function(xhr, type) {
				if(!src){
					w.close();
				}else if(src==1){
					$(page).find(".loadmore").html('<i class="fa fa-chevron-circle-down fa-lg"></i>&nbsp;&nbsp;加载更多');
					loadingmore=false;
				}else if(src==2){
					$(page).find(".ref").height("0px");
					setTimeout(function(){
						$(page).find(".ref").hide();
					},200);
				}
				plus.nativeUI.toast("网络错误");
			}
		});
	}


	/* 强制刷新以及缓存控制 */
	$(page).on('appShow',
	function() {
		/* 如果未加载则刷新 */
		if (!loaded) {
			ref();
		}
	});
	
	/* 注册按钮点击事件 */
	$(page).find('.app-button').on("click",
	function() {
		 if (this.id == "loadmore"&&loadingmore==false) {
			ref(pN + 1, 1 ,1);
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
				$(page).find(".app-input").val("");
			}
		}
	});
});