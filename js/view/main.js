var args = GetRequest();

var articleTitle = args['title'];
var URL = "https://raw.githubusercontent.com/ching2016/MyWebsite/master/data/article/"+articleTitle+".txt"

// console.log(args);
// console.log(articleTitle);

$.ajax({
    url:URL,
    success:function(data){
        $("#content").html(S(data));
        console.log(data);
    }
})

//解密并获取url参数
function GetRequest() {
    var url = decodeURI(location.search); //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
       var str = url.substr(1);
       strs = str.split("&");
       for(var i = 0; i < strs.length; i ++) {
          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
       }
    }
    return theRequest;
 }

// $(".title").on("click",function(){
//     console.log(encodeURI(URL));
//     console.log(decodeURI(args));
// });
// $.load(URL,function(data){
    // console.log(data);
// });
