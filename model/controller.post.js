App.controller('post',
function(page) {
	$(page).find('.app-button').on("click",
	function() {
		if (this.id == "take") {
			var cmr = plus.camera.getCamera();
			cmr.captureImage(function(path) {
				plus.gallery.save(path);
				$(page).find(".lookat").attr("src", "http://localhost:13131/" + path);
				$(page).find(".imagesec").show();
			},
			function(e) {},
			{
				filename: "_doc/gallery/",
				index: 1
			});

		} else if (this.id == "select") {
			plus.gallery.pick(function(path) {
				$(page).find(".lookat").attr("src", path);
				$(page).find(".imagesec").show();
			},
			function(e) {},
			{
				filter: "image"
			});

		} else if (this.id == "clear") {
			$(page).find(".lookat").removeAttr("src");
			$(page).find(".imagesec").hide();

		} else if (this.id == "post") {
			if ($(page).find(".w-title").val().trim() == "" || $(page).find(".w-content").val().trim() == "") {
				plus.nativeUI.toast("缺少必填项");
				return 0;
			}
			
			var w = plus.nativeUI.showWaiting("正在准备...");
			
			
			var task = plus.uploader.createUpload('http://' + localStorage.service + '/api/posts/create_post/', {
				method: "POST",
				blocksize: 204800,
				priority: 100
				},
				function(t, status) {
					if (status == 200) {
						w.close();
						console.log("Upload: " + t.responseText);
						loaded=false;
						App.back();
					} else {
						w.close();
						plus.nativeUI.toast("发布失败");
						alert("Upload failed: " + status);
					}
			});
			
			var img = plus.uploader.createUpload('http://upload.qiniu.com/', {
				method: "POST",
				blocksize: 204800,
				priority: 100
				},
				function(t, status) {
					if (status == 200) {
						var c=JSON.parse(t.responseText);
						w.setTitle("正在发布百科...");
						task.addData("image",c.url);
						task.start();
						
					} else {
						w.close();
						plus.nativeUI.toast("发布失败");
						alert("Upload failed: " + status);
					}
			});
			
			
			task.addData("title", $(page).find(".w-title").val());
			task.addData("content", within($(page).find(".w-content").val()));
			task.addData("categories", "['" + $(page).find(".w-cate").val()+ "']");
			task.addData("cookie", localStorage["cookie"]);
			task.addData("status", "publish");
			
			if($(page).find(".lookat").attr("src")){
				img.addFile($(page).find(".lookat").attr("src"),{key:"file"});
				w.setTitle("正在获取授权...");
				$.ajax({
					type: 'GET',
					url: 'http://' + localStorage.service + '/uptoken.php',
					dataType: 'text',
					cache:false,
					timeout: 20000,
					context: $('body'),
					success: function(data) {
						w.setTitle("正在上传图片...");
						img.addData("token",data);
						img.start();
					},
					error: function(xhr, type) {
						w.close();
						plus.nativeUI.toast("网络错误");
					}
				});
			}else{
				w.setTitle("正在发布百科...");
				task.start();
			}
			

		}
	});
});