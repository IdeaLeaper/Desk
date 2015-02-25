if (window.plus) {
			plusReady();
		} else {
			document.addEventListener("plusready", plusReady, false);
		}

		function plusReady() {
			plus.navigator.setStatusBarBackground( "#045FB4" );
			plus.key.addEventListener("backbutton",function(){
				if(App.back()==false){
					App.dialog({
					  title        : '来自课桌的提示',
					  text         : '你真的要退出课桌吗',
					  okButton     : '是的',
					  cancelButton : '取消',
					}, function (ret) {
					  if (ret) {
					    plus.runtime.quit();
					  }
					});
				}
			});
		if(localStorage.service){
			if (!localStorage.cookie) {
				App.load('index');
			} else {
				App.load('home');
			}
		}else{
			App.load("ac");
		}
		}
		