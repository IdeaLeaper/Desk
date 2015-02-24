App.controller('post',
		function(page) {
				$(page).find('.app-button').on('click',function(){
					if(this.id == "take"){
							var cmr = plus.camera.getCamera();
							cmr.captureImage( function ( path ) {
								plus.gallery.save(path);
								$(page).find(".lookat").attr("src","http://localhost:13131/"+path);
								$(page).find(".imagesec").show();
							}, function ( e ) {
							}, {filename:"_doc/gallery/",index:1} );
							
							
					}else if(this.id == "select"){
						plus.gallery.pick( function(path){
							$(page).find(".lookat").attr("src", path);
							$(page).find(".imagesec").show();
					    }, function ( e ) {
					    }, {filter:"image"} );
					    
					    
					}else if(this.id == "clear"){
						$(page).find(".lookat").attr("src", "");
						$(page).find(".imagesec").hide();
						
						
					}else if(this.id =="cate"){
						plus.nativeUI.actionSheet({
						title: "更改百科分类",
						cancel: "取消",
						buttons: [{
							title: "原创"
						},
						{
							title: "人物"
						},
						{
							title: "科技"
						},
						{
							title: "生活"
						},
						{
							title: "艺术"
						},
						{
							title: "自然"
						},
						{
							title: "其他"
						}]
					},
					function(e) {
						var slug;
						var name;
						var icon;
						switch(e.index){
						case 1:
							slug="original";
							name="原创";
							icon="star";
							break;
						case 2:
							slug="person";
							name="人物";
							icon="user";
							break;
						case 3:
							slug="tech";
							name="科技";
							icon="laptop";
							break;
						case 4:
							slug="life";
							name="生活";
							icon="calendar";
							break;
						case 5:
							slug="art";
							name="艺术";
							icon="play";
							break;
						case 6:
							slug="nature";
							name="自然";
							icon="leaf";
							break;
						case 7:
							slug="other";
							name="其他";
							icon="th";
							break;
						default:
							return 0;
						}
						$(page).find(".w-cate").html('<i class="fa fa-'+icon+' fa-lg"></i>&nbsp;&nbsp;'+name);
						$(page).find(".w-cate").attr("title",slug);
					});
					
					
					}else if(this.id == "post"){
						if($(page).find(".w-title").attr("value").trim()==""||$(page).find(".w-content").attr("value").trim()==""){
							plus.nativeUI.toast("缺少必填项");
							return 0;
						}
						var w = plus.nativeUI.showWaiting("正在发布...");
						var task = plus.uploader.createUpload( 'http://'+service+'/api/posts/create_post/', 
										{ method:"POST",blocksize:204800,priority:100 },
										function ( t, status ) {
											if ( status == 200 ) { 
												w.close();
												plus.nativeUI.toast("发布成功");
												console.log( "Upload success: " + t.responseText );
												localStorage.removeItem("postarr");
												App.back();
											} else {
												w.close();
												plus.nativeUI.toast("发布失败");
												console.log( "Upload failed: " + status );
											}
										}
						);
						if($(page).find(".lookat").attr("src")){
										task.addFile($(page).find(".lookat").attr("src"),{key:"attachment"});
						}
									task.addData( "title", $(page).find(".w-title").attr("value"));
									task.addData( "title_plain", $(page).find(".w-title").attr("value"));
									task.addData( "content", within($(page).find(".w-content").attr("value")));
									task.addData( "categories", "['"+$(page).find(".w-cate").attr("title")+"']");
									task.addData( "cookie", localStorage["cookie"]);
									task.addData( "status", "publish");
									task.start();	

					}
				});
});