App.controller('comment',
		function(page, argv) {
			$(page).find(".app-title").text("评论 '"+argv.obj.posts[argv.id].title+"'");
			
			function ref(){
				var w = plus.nativeUI.showWaiting("正在加载评论...");
				$.ajax({
								type: 'GET',
								url: 'http://'+localStorage.service+'/api/get_post/?id='+argv.obj.posts[argv.id].id,
								dataType: 'json',
								timeout: 20000,
								context: $('body'),
								success: function(data) {
									if(data.post.comment_count!=0){
										var compound="";
										for(var i=0;i<=data.post.comment_count-1;i++){
											compound+="<div class='app-section' id="
											+i+"><h4>"+without(data.post.comments[i].name)
											+"&nbsp;&nbsp;<small>"+data.post.comments[i].date+"</small></h4>"
											+data.post.comments[i].content
											+"</div>";
										}
										$(page).find(".commentsList").html(compound);
									}else{
										$(page).find(".commentsList").html("<div class='app-section'>暂无评论</div>");
									}
									w.close();
								},
								error: function(xhr, type) {
									w.close();
									plus.nativeUI.toast("网络错误");
								}
				});
			}
			
			$(page).find(".app-button").on("click",function(){
				if(this.id == "send"){
					var wcontent=$(page).find(".w-content").attr("value");
					if(wcontent.trim()!=""){
						var w = plus.nativeUI.showWaiting("正在发布评论...");
						$.ajax({
								type: 'POST',
								url: 'http://'+localStorage.service+'/api/submit_comment/',
								data:{post_id:argv.obj.posts[argv.id].id,content:wcontent,name:"auto",email:"auto@auto.com",cookie:localStorage.cookie},
								dataType: 'json',
								timeout: 20000,
								context: $('body'),
								success: function(data) {
									w.close();
									if(data.status=="ok"){
										plus.nativeUI.toast("发布成功");
										ref();
									}else{
										plus.nativeUI.toast("发布失败");
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
			
			ref();
});