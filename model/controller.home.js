App.controller("home",
		function(page) {
			
			$(page).find(".app-content").dropload().on('dropload',function(e,me){
		ref();
		setTimeout(function(){
        me.resetload();
      },600);
});
			
			function ref(p){
				if(!p){p=1};
				var w = plus.nativeUI.showWaiting("正在更新内容, 请稍后...");
				
				$.ajax({
							type: 'GET',
							url: 'http://'+localStorage.service+'/api/get_recent_posts/?page='+p,
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
										//console.log(data.posts[i].attachments[0].images["thumbnail"].url);
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
								$(page).find(".postsList").html(compound);
								$(page).find('.listClick').on('click',function(){
									App.load("view",{id:this.id,obj:postarr});
								});
								loaded=true;
								dataDate=new Date().format("ymd");
								pN=p;
								if(data.count<data.count_total&&data.count==10){
									$(page).find(".loadmore").show();
									if(pN>=2){
										$(page).find(".loadless").show();
										$(page).find(".loadless").css("width","50%");
									}else{
										$(page).find(".loadless").hide();
									}
								}else{
									$(page).find(".loadless").show();
									$(page).find(".loadless").css("width","100%");
									$(page).find(".loadmore").hide();
								}
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
    			if(!loaded){
					ref();
				}else if(new Date().format("ymd")>dataDate){
					ref();
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
				}else if(this.id=="loadmore"){
					ref(pN+1);
				}else if(this.id=="loadless"){
					ref(pN-1);
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