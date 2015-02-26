					App.controller('center', function (page) {
							$(page).find(".myname").text(localStorage.username);
							$(page).find(".area").text(localStorage.area);
							if(!localStorage.useremail){
							var w = plus.nativeUI.showWaiting("正在加载个人信息...");
				$.ajax({
							type: 'GET',
							url: 'http://'+localStorage.service+'/api/user/get_currentuserinfo/?cookie='+localStorage.cookie,
							dataType: 'json',
							timeout: 20000,
							context: $('body'),
							success: function(data) {
								w.close();
								$(page).find(".myemail").text(data.user.email);
								$(page).find(".myregtime").text(data.user.registered);
								localStorage["useremail"]=data.user.email;
								localStorage["userregtime"]=data.user.registered;
								plus.nativeUI.toast("信息加载成功");
							},
							error: function(xhr, type) {
								w.close();
								plus.nativeUI.toast("网络错误");
							}
						});
						}else{
							$(page).find(".myemail").text(localStorage.useremail);
							$(page).find(".myregtime").text(localStorage.userregtime);
						}
						
						
							$(page).find(".app-button").on("click",function(){
								if(this.id == "logout"){
									localStorage.removeItem("cookie");
									localStorage.removeItem("username");
									localStorage.removeItem("useremail");
									localStorage.removeItem("userregtime");
									loaded=false;
									App.load('index');
									App.removeFromStack(0,2);
								}else if(this.id == "exarea"){
									plus.nativeUI.actionSheet({
										title: "请选择地区, 切换后您将被登出.",
										cancel: "取消",
										buttons: [{
											title: "中国大陆地区"
										},
										{
											title: "国际地区"
										}]
									},
									function(e) {
										if (e.index == 1){
											localStorage["area"]="中国大陆地区";
											localStorage["service"]="skypt.cn";
											localStorage.removeItem("cookie");
											localStorage.removeItem("username");
											localStorage.removeItem("useremail");
											localStorage.removeItem("userregtime");
											loaded=false;
											App.load('index');
											App.removeFromStack(0,2);
										}
										else if (e.index == 2) {
											localStorage["area"]="国际地区";
											localStorage["service"]="skypt.cn";
											localStorage.removeItem("cookie");
											localStorage.removeItem("username");
											localStorage.removeItem("useremail");
											localStorage.removeItem("userregtime");
											loaded=false;
											App.load('index');
											App.removeFromStack(0,2);
										}
									});
								}
							});
						});