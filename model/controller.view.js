App.controller('view',
		function(page, argv) {
			$(page).find('.app-title').text(argv.obj.posts[argv.id].title);
			$(page).find('.content').html(argv.obj.posts[argv.id].content);
			$(page).find('.cate').text(argv.obj.posts[argv.id].categories[0].title);
			$(page).find('.creator').text(argv.obj.posts[argv.id].author.name);
			$(page).find('.time').text(argv.obj.posts[argv.id].modified);
			if(argv.obj.posts[argv.id].attachments[0]){
			var iturl=argv.obj.posts[argv.id].attachments[0].images["medium"].url;
			$(page).find('.image').attr('src',iturl);
			$(page).find('.image').on("load",function(){
				$(page).find('.image').show();
				$(page).find('.status').hide();
			});
			}else{
				$(page).find('.imagesec').hide();
			}
			
			$(page).find(".app-button").on("click",function(){
				if(this.id == "comment"){
					App.load("comment",{id:argv.id,obj:argv.obj});
				}
			});
			
			$(page).find(".image").on("click",function(){
				if(argv.obj.posts[argv.id].attachments[0].images["large"]){
					App.load('viewer', {
					  url:argv.obj.posts[argv.id].attachments[0].images["large"].url
					});
				}else{
					App.load('viewer', {
					  url:argv.obj.posts[argv.id].attachments[0].images["full"].url
					});
				}
			})
});


App.controller('viewer', function (page, data) {
  		$(page).find(".app-content").css("background","url("+loaderImg+") no-repeat center center");
  		setTimeout(function(){
  			$(page).find(".image").attr("src",data.url);
  		},200);
  		$(page).find(".image").on("load",function(){
  			$(page).find(".app-content").css("background","#000");
  			$(page).find(".image").show();
  		})
});