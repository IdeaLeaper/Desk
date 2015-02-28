App.controller('index',
function(page) {
	if(localStorage.area=="中国大陆地区"){
		$(page).find(".area").val("cn");
	}else{
		$(page).find(".area").val("inter");
	}
	
	$(page).find(".area").on("change",function(){
		if(this.value=="cn"){
			localStorage["area"]="中国大陆地区";
			localStorage["china"]=1;
			localStorage["service"]="skypt.cn";
		}else{
			localStorage["area"]="国际地区";
			localStorage["china"]=0;
			localStorage["service"]="desk.cdn.ileaper.com";
		}
	})
});