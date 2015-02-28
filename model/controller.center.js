App.controller('center',
function(page) {
	$(page).find(".myname").text(localStorage.username);
	$(page).find(".area").text(localStorage.area);
	
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
		} else if (this.id == "_clearLocalStorage") {
			localStorage.clear();
		} else if (this.id == "_cookie") {
			console.log(localStorage.cookie);
		}
	});
});