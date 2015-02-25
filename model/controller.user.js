App.controller('login',
		function(page) {
			$(page).find('.app-button').on('click',
			function() {
				if (this.id == "login_btnLogin") {
					var w = plus.nativeUI.showWaiting("正在验证, 请稍后...");
					var username = encodeURIComponent($("#login_username").attr("value"));
					var password = encodeURIComponent($("#login_password").attr("value"));
					
					$.ajax({
						type: 'GET',
						url: 'http://'+localStorage.service+'/api/user/generate_auth_cookie/?username=' + username + "&password=" + password,
						dataType: 'json',
						timeout: 10000,
						context: $('body'),
						success: function(data) {
							w.close();
							if (data.status == "error") {
								console.log(data.error);
								plus.nativeUI.toast("登陆失败, 用户名或密码不正确");
							} else {
								localStorage.setItem("cookie", data.cookie);
								localStorage.setItem("username",decodeURIComponent(username));
								plus.nativeUI.toast("登陆成功");
								App.load('home');
								App.removeFromStack(0,2);
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

App.controller('reg',
		function(page) {
			$(page).find('.app-button').on('click',
			function() {
				if (this.id == "reg_btnReg") {
					var username = encodeURIComponent($("#reg_username").attr("value"));
					var email = encodeURIComponent($("#reg_email").attr("value"));
					var pw = encodeURIComponent($("#reg_pw").attr("value"));
					var pw2 = encodeURIComponent($("#reg_pw2").attr("value"));
					if (pw == pw2) {
						var w = plus.nativeUI.showWaiting("正在注册...");
								$.ajax({
									type: 'GET',
									url: 'http://'+localStorage.service+'/api/user/register/?username=' + username + "&email=" + email + "&display_name=" + username + "&user_pass=" + pw,
									dataType: 'json',
									timeout: 10000,
									context: $('body'),
									success: function(ret) {
										w.close();
										if (ret.status == "error") {
											plus.nativeUI.toast("注册失败");
										} else {
											localStorage.setItem("cookie", ret.cookie);
											localStorage.setItem("username",decodeURIComponent(username));
											plus.nativeUI.toast("注册成功");
											App.load('home');
											App.removeFromStack(0,2);
										}
									},
									error: function(xhr, type) {
										w.close();
										plus.nativeUI.toast("网络错误");
									}
								});

					} else {
						plus.nativeUI.toast("两次密码不匹配");
					}
				}
			});
});