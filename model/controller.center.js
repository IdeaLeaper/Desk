					App.controller('center', function (page) {
							$(page).find(".myname").text(localStorage.username);
							if(!localStorage.useremail){
							var w = plus.nativeUI.showWaiting("正在加载个人信息...");
				$.ajax({
							type: 'GET',
							url: 'http://'+service+'/api/user/get_currentuserinfo/?cookie='+localStorage.cookie,
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
									localStorage.removeItem("compound");
									localStorage.removeItem("postarr");
									App.load('index');
									App.removeFromStack(0,2);
								}
							});
						});