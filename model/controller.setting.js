App.controller('setting',
function(page) {
	if(localStorage.service=="skypt.cn"){
		$(page).find(".speedStatus").text("中国大陆节点");
	}else if(localStorage.service=="desk.cdn.ileaper.com"){
		$(page).find(".speedStatus").text("国际节点");
	}else{
		$(page).find(".speedStatus").text("未知加速节点");
	}

	$(page).find(".app-button").on("click",
	function() {
		if (this.id == "logout") {
			localStorage.removeItem("cookie");
			localStorage.removeItem("username");
			localStorage.removeItem("useremail");
			loaded = false;
			App.load('index');
			App.removeFromStack(0, 2);
		}else if(this.id == "jiasu"){
				if(localStorage.service=="skypt.cn"){
					App.dialog({
						title: '加速节点切换',
						text: '您将要切换到 [国际] 节点, 如果您身处中国大陆地区, 请不要进行这个切换',
						okButton: '是的',
						cancelButton: '取消',
					},
					function(ret) {
						if (ret) {
							localStorage.service="desk.cdn.ileaper.com";
							$(page).find(".speedStatus").text("国际节点");
						}
					});
				}else{
					App.dialog({
						title: '加速节点切换',
						text: '您将要切换到 [中国大陆] 节点, 如果您身处国际地区, 将会影响您的加载速度',
						okButton: '是的',
						cancelButton: '取消',
					},
					function(ret) {
						if (ret) {
							localStorage.service="skypt.cn";
							$(page).find(".speedStatus").text("中国大陆节点");
						}
					});
				}
		}
	});
});