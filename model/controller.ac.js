					App.controller('ac', function (page) {
							$(page).find(".app-button").on("click",function(){
								if(this.id == "cn"){
									localStorage["area"]="中国大陆地区";
									localStorage["service"]="skypt.cn";
									App.load("index");
									App.removeFromStack(0,1);
								}else if(this.id == "国际地区"){
									localStorage["area"]="international";
									localStorage["service"]="us.skypt.cn";
									App.load("index");
									App.removeFromStack(0,1);
								}
							});
						});