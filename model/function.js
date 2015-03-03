var postarr;
var searcharr;
var pN=0;
var spN=0;
var loaded=false;
var view_loaded=false;
var search_loaded=false;
var center_loaded=false;
var searchTag=false;

Date.prototype.format = function(partten)
        {
            if(partten ==null||partten=='')
            {
                partten = 'y-m-d'    ;
            }
            var y = this.getYear();
            var m = this.getMonth()+1;
            var d = this.getDate();
            var r = partten.replace(/y+/gi,y);
            r = r.replace(/m+/gi,(m<10?"0":"")+m);
            r = r.replace(/d+/gi,(d<10?"0":"")+d);
            return r; 
        }

function without(str)   
{   
	return str.replace(/<\/?.+?>/g,"");
}

function within(sHtml) {
 return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
}

var loaderImg = [
		"data:image/gif;base64,",
		"R0lGODlhEAAQAPIAAAAAAP///zw8PLy8vP///5ycnHx8fGxsbCH+GkNyZWF0ZWQgd2l0aCBhamF4",
		"bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklr",
		"E2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAA",
		"EAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUk",
		"KhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9",
		"HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYum",
		"CYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzII",
		"unInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAF",
		"ACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJ",
		"ibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFG",
		"xTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdce",
		"CAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==",
].join('');

function getfilename(path){
	var i=path.lastIndexOf('/');
	if(i==-1){
		return path;
	}else{
		return path.substr(i+1,path.length-i-1);
	}
}

function devnotice(){
			App.dialog({
						title: '开发者提示',
						text: '目前这个功能还在制作中, 请等待下一个版本的更新',
						okButton: '我已了解'
			});
}
