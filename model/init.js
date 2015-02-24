if (window.plus) {
			plusReady();
		} else {
			document.addEventListener("plusready", plusReady, false);
		}

		function plusReady() {
			plus.navigator.setStatusBarBackground( "#045FB4" );
			plus.key.addEventListener("backbutton",function(){
				if(App.back()==false){
					plus.nativeUI.confirm( "你确定要退出课桌么?", function(e){
							if(e.index==0){
								plus.runtime.quit();
							}
					}, "课桌的温馨提示", ["是的","不"] );
				}
			});
			if (!localStorage.cookie) {
				App.load('index');
			} else {
				App.load('home');
			}
		}