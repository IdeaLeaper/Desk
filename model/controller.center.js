App.controller('center',
function(page) {
	$(page).find(".myname").text(localStorage.username);
	if(localStorage.service=="skypt.cn"){
		$(page).find(".speedStatus").text("中国大陆节点");
	}else if(localStorage.service=="desk.cdn.ileaper.com"){
		$(page).find(".speedStatus").text("国际节点");
	}else{
		$(page).find(".speedStatus").text("未知加速节点");
	}
	
	function loadcoin(){
		$.ajax({
					type: 'GET',
					url: 'http://' + localStorage.service + '/api/user/get_user_meta/?meta_key=wordpoints_points-coin&cookie=' + localStorage.cookie,
					dataType: 'json',
					cache:false,
					timeout: 20000,
					context: $('body'),
					success: function(data) {
						$(page).find(".mycoin").text(data["wordpoints_points-coin"][0]);
					},
					error: function(xhr, type) {
						plus.nativeUI.toast("网络错误");
					}
		});
	}
	
	
	function ref(p, mode) {
		/* 处理没有指定页码的情况 */
		if (!p) {
			p = 1
		};
		$.ajax({
			type: 'GET',
			url: 'http://' + localStorage.service + '/api/get_author_posts/?include=custom_fields,title&page=' 
			+ p 
			+ "&china=" 
			+ localStorage.china 
			+ "&author_slug=" 
			+ localStorage.username,
			dataType: 'json',
			cache: false,
			timeout: 20000,
			context: $('body'),
			success: function(data) {
				var compound = "";
				
				/* 组合页面元素 */
				for (var i = 0; i <= data.posts.length -1 ; i++) {
					
					var title=without(data.posts[i].title);
					
					if (mode == 1) {
						var id = i + searcharr.posts.length;
					} else {
						var id = i;
					}
					
						compound+='<div class="only-title-card listClick" id='+id+'>'+title+'</div>';
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
				center_loaded = true;

				/* 加载更多处理 */
				spN = p;
				$(page).find(".loadmore").hide();
				if (spN < data.pages) {
					$(page).find(".loadmore").show();
				}
			},
			error: function(xhr, type) {
				plus.nativeUI.toast("网络错误");
			}
		});
	}
	
	
	if (!localStorage.useremail) {
		var w = plus.nativeUI.showWaiting("正在获取信息...");
		$.ajax({
			type: 'GET',
			url: 'http://' + localStorage.service + '/api/user/get_currentuserinfo/?cookie=' + localStorage.cookie,
			dataType: 'json',
			timeout: 20000,
			cache:false,
			context: $('body'),
			success: function(data) {
				w.close();
				$(page).find(".myemail").text(data.user.email);
				localStorage["useremail"] = data.user.email;
			},
			error: function(xhr, type) {
				w.close();
				plus.nativeUI.toast("网络错误");
			}
		});
		
	} else {
		$(page).find(".myemail").text(localStorage.useremail);
	}


		/* 强制刷新以及缓存控制 */
	$(page).on('appShow',
	function() {
		/* 如果未加载则刷新 */
		if (!center_loaded) {
			loadcoin();
			ref();
		}
	});
	
	$(page).on('appDestroy',
	function() {
		center_loaded=false;
	});
});