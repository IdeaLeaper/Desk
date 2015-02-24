App.controller("search",
		function(page,argv) {
			$(page).find(".w-text").text(argv.text);
				var w = plus.nativeUI.showWaiting("正在更新内容, 请稍后...");
				$.ajax({
							type: 'GET',
							url: 'http://'+service+'/api/get_search_results/?search='+encodeURIComponent(argv.text),
							dataType: 'json',
							timeout: 20000,
							context: $('body'),
							success: function(data) {
								var compound="";
								searcharr=data;
								for(var i=0;i<=data.count-1;i++){
									compound+="<div class='app-section listClick' id="
									+i
									+">";
									if(data.posts[i].attachments[0]){
										compound+="<div style='float: left;width:50px;height:50px;background:url(\""+data.posts[i].attachments[0].images["thumbnail"].url+"\");background-size:100% 100%;'></div><div style='margin-left:60px;margin-top:-1px;'>";
									}
									
									compound+="<b>"+within(data.posts[i].title);
									if(data.posts[i].attachments[0]){
										compound+="&nbsp;&nbsp;<i class='fa fa-picture-o'></i>";
									}
									compound+="</b><br>"
									+without(data.posts[i].content).substr(0,30)
									+"...</div><div style='clear: both;'></div></div>";
								}
								if(data.count!=0){
									$(page).find(".postsList").html(compound);
								}else{
									$(page).find(".postsList").html("<div class='app-section'>没有找到这个条目相关的内容</div>");
								}
								$(page).find('.listClick').on('click',function(){
									App.load("view",{id:this.id,obj:searcharr});
								});
								w.close();
								plus.nativeUI.toast("数据加载成功");
							},
							error: function(xhr, type) {
								w.close();
								plus.nativeUI.toast("网络错误");
							}
						});
});