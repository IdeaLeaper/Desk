App.controller("search",
function(page, argv) {
	$(page).find(".w-text").text(argv.text);
	ref();
	function ref(p, mode) {
		if (!p) {
			p = 1
		};
		var w = plus.nativeUI.showWaiting("正在获取百科...");
		$.ajax({
			type: 'GET',
			url: 'http://' + localStorage.service + '/api/get_search_results/?include=custom_fields,attachments,title,excerpt&search=' + encodeURIComponent(argv.text) + "&page=" + p + "&china=" + localStorage.china,
			dataType: 'json',
			cache: false,
			timeout: 20000,
			context: $('body'),
			success: function(data) {
				var compound = "";
				for (var i = 0; i <= data.posts.length -1 ; i++) {
					compound += "<div class='app-section listClick' id=";
					if (mode == 1) {
						compound += i + searcharr.posts.length;
					} else {
						compound += i;
					}
					compound += ">";
					if (data.posts[i]["custom_fields"].image[0]) {
						compound += "<div style='float: left;width:50px;height:50px;background:url(\"" + data.posts[i]["custom_fields"].image[0] + "?imageView2/1/w/50/h/50\");background-size:100% 100%;'></div><div style='margin-left:60px;margin-top:-1px;'>";
					}
					compound += "<b>" + without(data.posts[i].title);
					if (data.posts[i]["custom_fields"].image[0]) {
						compound += "&nbsp;&nbsp;<i class='fa fa-picture-o'></i>";
					}
					var wexc = without(data.posts[i].excerpt) + "...";
					var n = wexc.search("继续阅读");
					compound += "</b><br>";
					if (n == -1) {
						compound += wexc;
					} else {
						compound += wexc.substr(0, n);
					}
					compound += "</div><div style='clear: both;'></div></div>";
				}

				
				if (mode == 1) {
					searcharr.posts = searcharr.posts.concat(data.posts);
					$(page).find(".postsList").html($(page).find(".postsList").html() + compound);
				} else {
					searcharr = data;
					$(page).find(".postsList").html(compound);
				}

				$(page).find('.listClick').on('click',
				function() {
					App.load("view", {
						id: this.id,
						obj: searcharr
					});
				});
				loaded = true;
				dataDate = new Date().format("ymd");
				spN = p;
				$(page).find(".loadmore").hide();
				if (spN < data.pages) {
					$(page).find(".loadmore").show();
				}
				w.close();
			},
			error: function(xhr, type) {
				w.close();
				plus.nativeUI.toast("网络错误");
			}
		});
	}

	$(page).find('.app-button').on('click',
	function() {
		if (this.id == "loadmore") {
			ref(spN + 1, 1);
		}
	});

});