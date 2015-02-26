					App.controller('ac', function (page) {
							$(page).find(".app-button").on("click",function(){
								if(this.id == "cn"){
									localStorage["area"]="中国大陆地区";
									localStorage["china"]=1;
									App.load("index");
									App.removeFromStack(0,1);
								}else if(this.id == "international"){
									localStorage["area"]="国际地区";
									localStorage["china"]=0;
									App.load("index");
									App.removeFromStack(0,1);
								}
							});
						});