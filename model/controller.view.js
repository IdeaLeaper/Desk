App.controller('view',
function(page, argv) {
	var w = plus.nativeUI.showWaiting("正在获取内容...");
	$(page).find('.app-title').text(argv.obj.posts[argv.id].title);
	if (argv.obj.posts[argv.id]["custom_fields"].image) {
		var iturl = argv.obj.posts[argv.id]["custom_fields"].image[0]+"?imageView2/0/w/400";
		$(page).find('.image').attr('src', iturl);
		$(page).find('.image').on("load",
		function() {
			$(page).find('.imagesec').show();
		});
	}
	$.ajax({
		type: 'GET',
		url: 'http://' + localStorage.service + '/api/get_post/?include=content,author,categories,modified&post_id=' + argv.obj.posts[argv.id].id,
		dataType: 'json',
		cache: false,
		timeout: 20000,
		context: $('body'),
		success: function(data) {
			$(page).find('.content').html(data.post.content);
			$(page).find('.cate').text(data.post.categories[0].title);
			$(page).find('.creator').text(data.post.author.name);
			$(page).find('.time').text(data.post.modified);
			$(page).find('.info').show();
			$(page).find(".edit").show();
			w.close();
		},
		error: function(xhr, type) {
			w.close();
			plus.nativeUI.toast("网络错误");
		}
	});

	$(page).find(".app-button").on("click",
	function() {
		if (this.id == "comment") {
			App.load("comment", {
				id: argv.id,
				obj: argv.obj
			});
		}
	});

	$(page).find(".image").on("click",
	function() {
		if(argv.obj.posts[argv.id]["custom_fields"].image){
			App.load('viewer', {
				url: argv.obj.posts[argv.id]["custom_fields"].image[0]+"?imageView2/4/w/600"
			});
		}
	})
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