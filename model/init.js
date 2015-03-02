if (window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

function plusReady() {
	plus.webview.WebviewBounceStyle={position:"none"};
	plus.navigator.setStatusBarBackground(" #1565C0");
	plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackOpaque");
	plus.key.addEventListener("backbutton",
	function() {
		if (App.back() == false) {
			App.dialog({
				title: '来自课桌的提示',
				text: '你真的要退出课桌吗',
				okButton: '是的',
				cancelButton: '取消',
			},
			function(ret) {
				if (ret) {
					plus.runtime.quit();
				}
			});
		}
	});
	if(!localStorage.service){
		localStorage["service"]="skypt.cn";
	}
	if (!localStorage.cookie) {
		App.load('index');
	} else {
		App.load('home');
	}
}