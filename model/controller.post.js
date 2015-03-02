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
			
			/* 发布百科UPLOADER */
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
						App.back("home");
					} else {
						w.close();
						plus.nativeUI.toast("发布失败");
						alert("Upload failed: " + status);
					}
			});
			
			/* 上传图片UPLOADER */
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
			
			/* 将中文逗号转化成英文逗号 */
			var tagsource=$(page).find(".tags").val();
			tagsource=tagsource.replace(/\s*，\s*/g,",");
			
			/* 添加数据 */
			task.addData("title", $(page).find(".w-title").val());
			task.addData("content", within($(page).find(".w-content").val()));
			task.addData("tags", tagsource);
			task.addData("cookie", localStorage["cookie"]);
			task.addData("status", "publish");
			
			
			/* 获得上传图片证书 */
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