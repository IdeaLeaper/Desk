App.controller('comment',
function(page, argv) {
	$(page).find(".app-title").text("评论 '" + argv.obj.posts[argv.id].title + "'");

	function ref() {
		var w = plus.nativeUI.showWaiting("正在加载评论...");
		$.ajax({
			type: 'GET',
			url: 'http://' + localStorage.service + '/api/get_post/?include=comments&post_id=' + argv.obj.posts[argv.id].id,
			dataType: 'json',
			cache: false,
			timeout: 20000,
			context: $('body'),
			success: function(data) {
				if (data.post.comments.length != 0) {
					var compound = "";
					for (var i = 0; i <= data.post.comments.length - 1; i++) {
						compound += "<div class='comments' id=" 
						+ i 
						+ "><div class='comments-title'>" 
						+ without(data.post.comments[i].name) 
						+ ":</div><div class='comments-content'>"
						+ data.post.comments[i].content 
						+ "</div></div>";
					}
					$(page).find(".commentsList").html(compound);
				} else {
					$(page).find(".commentsList").html("<div style='height:20px;'></div><div style='text-align:center;color:#9E9E9E;padding:15px;font-size:18px;'>目前还没有评论</div>");
				}
				w.close();
			},
			error: function(xhr, type) {
				w.close();
				plus.nativeUI.toast("网络错误");
			}
		});
	}

	$(page).find(".app-button").on("click",
	function() {
		if (this.id == "send") {
			var wcontent = $(page).find(".w-content").val();
			if (wcontent.trim() != "") {
				var w = plus.nativeUI.showWaiting("正在发布评论...");
				$.ajax({
					type: 'POST',
					url: 'http://' + localStorage.service + '/api/submit_comment/',
					data: {
						post_id: argv.obj.posts[argv.id].id,
						content: wcontent,
						name: "auto",
						email: "auto@auto.com",
						cookie: localStorage.cookie
					},
					dataType: 'json',
					timeout: 20000,
					context: $('body'),
					cache:false,
					success: function(data) {
						w.close();
						if (data.status == "ok") {
							$(page).find(".w-content").val("");
							plus.nativeUI.toast("发布成功");
							ref();
						} else {
							plus.nativeUI.toast("发布失败");
						}
					},
					error: function(xhr, type) {
						w.close();
						plus.nativeUI.toast("网络错误或内容重复");
					}
				});
			}else{
				plus.nativeUI.toast("您没有填写评论");
			}
		}
	});

	ref();
});