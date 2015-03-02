App.controller('center',
function(page) {
	$(page).find(".myname").text(localStorage.username);
	if(localStorage.service=="skypt.cn"){
		$(page).find(".speedStatus").text("中国大陆节点");
	}else if(localStorage.service=="desk.cdn.ileaper.com"){
		$(page).find(".speedStatus").text("国际节点");
	}else{
		$(page).find(".speedStatus").text("未知加速节点");
	}
	
	function loadcoin(){
		$.ajax({
					type: 'GET',
					url: 'http://' + localStorage.service + '/api/user/get_user_meta/?meta_key=wordpoints_points-coin&cookie=' + localStorage.cookie,
					dataType: 'json',
					cache:false,
					timeout: 20000,
					context: $('body'),
					success: function(data) {
						$(page).find(".mycoin").text(data["wordpoints_points-coin"][0]);
					},
					error: function(xhr, type) {
						plus.nativeUI.toast("网络错误");
					}
		});
	}
	
	if (!localStorage.useremail) {
		var w = plus.nativeUI.showWaiting("正在获取信息...");
		$.ajax({
			type: 'GET',
			url: 'http://' + localStorage.service + '/api/user/get_currentuserinfo/?cookie=' + localStorage.cookie,
			dataType: 'json',
			timeout: 20000,
			cache:false,
			context: $('body'),
			success: function(data) {
				w.close();
				$(page).find(".myemail").text(data.user.email);
				$(page).find(".myregtime").text(data.user.registered);
				localStorage["useremail"] = data.user.email;
				localStorage["userregtime"] = data.user.registered;
				loadcoin();
			},
			error: function(xhr, type) {
				w.close();
				plus.nativeUI.toast("网络错误");
			}
		});
		
	} else {
		$(page).find(".myemail").text(localStorage.useremail);
		$(page).find(".myregtime").text(localStorage.userregtime);
		loadcoin();
	}

	$(page).find(".app-button").on("click",
	function() {
		if (this.id == "logout") {
			localStorage.removeItem("cookie");
			localStorage.removeItem("username");
			localStorage.removeItem("useremail");
			localStorage.removeItem("userregtime");
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
		}else if(this.id == "changePwd"||this.id=="mybaike"){
			devnotice();
		}
	});
});