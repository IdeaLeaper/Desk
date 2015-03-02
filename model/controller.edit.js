App.controller('edit',
function(page,argv) {
	$(page).find(".w-content").val(argv.content);
	
	/* 重组标签到value形式 */
	var tags="";
	for(var i=0;i<=argv.tags.length-1;i++){
		tags+=argv.tags[i].title;
		if(i!=argv.tags.length-1){
			tags+=",";
		}
	}
	$(page).find(".tags").val(tags);
	$(page).find(".w-name").text(argv.title);
	
	$(page).find('.app-button').on("click",
	function() {
			if (this.id == "post") {
				if ($(page).find(".w-content").val().trim() == "") {
					plus.nativeUI.toast("缺少必填项");
					return 0;
				}
				var w = plus.nativeUI.showWaiting("正在更新...");
				
				/* 将中文逗号转化成英文逗号 */
				var tagsource=$(page).find(".tags").val();
				tagsource=tagsource.replace(/\s*，\s*/g,",");
				
				$.ajax({
					type: 'GET',
					url: 'http://' + localStorage.service + '/api/posts/update_post/',
					dataType: 'json',
					data: {
						post_id: argv.id,
						content: $(page).find(".w-content").val().trim(),
						tags:tagsource,
						cookie: localStorage.cookie
					},
					cache: false,
					timeout: 20000,
					context: $('body'),
					success: function(data) {
						console.log(JSON.stringify(data));
						w.close();
						if(data.status=="ok"){
							/* 编辑成功执行强制刷新 */
							loaded=false;
							view_loaded=false;
							search_loaded=false;
							App.back();
							plus.nativeUI.toast("编辑成功");
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
	});
});