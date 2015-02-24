App.controller("home",
		function(page) {
			
			document.addEventListener( "resume", function(){
				if(new Date().format("ymd")>localStorage.dataDate){
					ref();
				}
			});
			
			function ref(){
				var w = plus.nativeUI.showWaiting("正在更新内容, 请稍后...");
				$.ajax({
							type: 'GET',
							url: 'http://'+service+'/api/get_recent_posts',
							dataType: 'json',
							timeout: 20000,
							context: $('body'),
							success: function(data) {
								var compound="";
								postarr=data;
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
								localStorage["postarr"]=JSON.stringify(postarr);
								localStorage["compound"]=compound;
								$(page).find(".postsList").html(compound);
								$(page).find('.listClick').on('click',function(){
									App.load("view",{id:this.id,obj:postarr});
								});
								localStorage["dataDate"]=new Date().format("ymd");
								w.close();
								plus.nativeUI.toast("数据加载成功");
							},
							error: function(xhr, type) {
								w.close();
								plus.nativeUI.toast("网络错误");
							}
						});
			}
			
			$(page).on('appShow', function () {
    			if(!localStorage["postarr"]){
					ref();
				}else if(new Date().format("ymd")>localStorage.dataDate){
					ref();
				}else{
					postarr=JSON.parse(localStorage["postarr"]);
					var compound=localStorage["compound"];
					$(page).find(".postsList").html(compound);
					$(page).find('.listClick').on('click',function(){
						App.load("view",{id:this.id,obj:postarr});
					});
				}
  			});
			

			$(page).find('.app-button').on('click',
			function() {
				if (this.id == "new") {
					plus.nativeUI.actionSheet({
						title: "Welcome back, "+localStorage.username + "!",
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
						if (e.index == 1){
							App.load("post");
						}
						else if (e.index == 3) {
							App.load("center");
						}
					});
				}else if(this.id=="refresh"){
					ref();
				}
			});
			
			$(page).find(".app-input").on('keydown',function(){
				if(event.keyCode==13){
					if($(page).find(".app-input").attr("value").trim()!=""){
						App.load("search",{text:$(page).find(".app-input").attr("value").trim()});
					}
				}
			})
});