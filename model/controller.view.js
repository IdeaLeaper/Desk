App.controller('view',
function(page, argv) {
	var fullData;
	
	/* 刷新百科显示 */
	function ref(){
		//var w = plus.nativeUI.showWaiting("正在获取内容...");
		$(page).find('.app-title').text(argv.obj.posts[argv.id].title);
		$.ajax({
			type: 'GET',
			url: 'http://' + localStorage.service + '/api/get_post/?include=custom_fields,content,author,tags&post_id=' + argv.obj.posts[argv.id].id,
			dataType: 'json',
			cache: false,
			timeout: 20000,
			context: $('body'),
			success: function(data) {
				$(page).find('.loading').hide();
				fullData=data;
				$(page).find('.content').html(data.post.content);
				$(page).find('.tags').empty();
				for(var i=0;i<=data.post.tags.length-1;i++){
					$(page).find('.tags').append(without(data.post.tags[i].title)+"&nbsp;");
				}
				if(data.post.tags.length==0){
					$(page).find('.tags-contain').text("这篇百科没有标签");
				}
				if (data.post["custom_fields"].image) {
					var iturl = data.post["custom_fields"].image[0]+"?imageView2/1/w/400/h/400";
					$(page).find('.image').removeAttr('src');
					$(page).find('.image').attr('src',iturl);
					$(page).find('.image').on("load",
					function() {
						$(page).find('.imagesec').show();
					});
					if($(page).find('.image').complete){
						$(page).find('.imagesec').show();
					}
				}
				$(page).find('.creator').text(data.post.author.name);
				$(page).find('.info').show();
				$(page).find(".edit").show();
				view_loaded=true;
				//w.close();
			},
			error: function(xhr, type) {
				//w.close();
				plus.nativeUI.toast("网络错误");
				$(page).find('.load-text').text("加载失败, 请重新打开本页面");
			}
		});
	}

	/* 注册按钮点击事件 */
	$(page).find(".app-button").on("click",
	function() {
		if (this.id == "comment") {
			App.load("comment", {
				id: argv.id,
				obj: argv.obj
			});
		}else if(this.id == "edit"){
			if(localStorage.username == fullData.post.author.name){
				App.load("edit", {
					content:$(page).find('.content').text(),
					title:$(page).find('.app-title').text(),
					tags:fullData.post.tags,
					id: fullData.post.id
				});
			}else{
				var w = plus.nativeUI.showWaiting("正在检测权限");
				$.ajax({
					type: 'GET',
					url: 'http://' + localStorage.service + '/api/user/get_user_meta/?cookie='+localStorage.cookie+"&meta_key=d_user_level",
					dataType: 'json',
					cache: false,
					timeout: 20000,
					context: $('body'),
					success: function(data) {
						w.close();
						if(data["d_user_level"][0]>=7){
							App.load("edit", {
								content:$(page).find('.content').text(),
								title:$(page).find('.app-title').text(),
								tags:fullData.post.tags,
								id: fullData.post.id
							});
						}else{
							plus.nativeUI.toast("您没有编辑权限");
						}
					},
					error: function(xhr, type) {
						w.close();
						plus.nativeUI.toast("网络错误");
					}
				});
			}
		}
	});
	
	$(page).find(".query").on("click",function(){
		devnotice();
	});

	/* 注册图片点击事件 */
	$(page).find(".image").on("click",
	function() {
		if(fullData.post["custom_fields"].image){
			App.load('viewer', {
				url: fullData.post["custom_fields"].image[0]+"?imageView2/4/w/600/h/800"
			});
		}
	})
	
	
	/* 强制刷新以及缓存控制 */
	$(page).on('appLayout',
	function() {
		/* 如果未加载则刷新 */
		if (!view_loaded) {
			$(page).find('.info').hide();
			$(page).find(".edit").hide();
			$(page).find(".imagesec").hide();
			$(page).find('.loading').show();
			ref();
		}
	});
	
	$(page).on('appDestroy',
	function() {
		view_loaded=false;
	});
	
});

App.controller('viewer',
function(page, data) {
	$(page).find(".app-content").css("background", "url(" + loaderImg + ") no-repeat center center");
	setTimeout(function() {
		$(page).find(".image").attr("src", data.url);
	},
	200);
	$(page).find(".image").on("load",
	function() {
		$(page).find(".app-content").css("background", "#000");
		$(page).find(".image").show();
	})
});