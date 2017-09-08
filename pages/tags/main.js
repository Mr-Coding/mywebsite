var jsonRes = {};
var args = GetRequest();
const search = $("#search");

$.ajax({
    url:"https://raw.githubusercontent.com/ching2016/MyWebsite/master/data/data.json",
    dataType: 'json',
    success:function(data){
        // console.log(data);
        jsonRes = data;
        makeTagList(data);
    }
})

// 创建标签列表
function makeTagList(data){
    var tagArr = [];
    var [isRepeatTag,temp] = [false,""];
    var count = 0;
    for(let i = 0;i < data.length;i ++){
        for(let j = 0;j < data[i].tag.length;j ++){
            let tag = data[i].tag[j];
            isRepeatTag = isRepeat(tagArr,tag);
            // console.log(tag+" --- isRepeatTag --- "+isRepeatTag);
            if(!isRepeatTag){
                tagArr.push(tag);
                // console.log("--- 没有重复 ---");
                temp = `<a class="tag tag-${count}">${tag}</a>`
                $(".tags").append(temp);
                count ++;
            }
        }
    }
    tagResult(tagArr);
}
// 给makeTagList函数来检查是否有重复标签的函数
function isRepeat(arr,str){
　　for(var i in arr) {
        if(arr[i] === str){
    　　　　return true;
        }   
　　}
　　return false;
}

function tagInit(tagArr){
    var [tag1,tag2] = ["",""];
    if(args.tag){   // 如果有get传值就用get传的值
        tag1 = args.tag;
    }else{  //  没有就用第一个
        tag1 = tagArr[0];    
    }
    let count = 0;
    $(".tag-result-container").empty();
    // tag1 = tagArr[0];
    for(let i = 0;i < jsonRes.length;i ++){
        for(let j = 0;j < jsonRes[i].tag.length;j ++){
            tag2 = jsonRes[i].tag[j];
            if(tag1 === tag2){
                count ++;
                // console.log(tag1+" "+tag2);  console.log(jsonRes[i].title);
                temp = `<a class="tag-result" target="_blank" href="../view/view.html?title=${jsonRes[i].title}"><h3>${jsonRes[i].title}</h3></a>`;
                $(".tag-result-container").append(temp);                    
            }
        }
    }
    // $(".tag-result-count").text(tag1+" 标签下共"+count+"篇");
    $(".tag-result-count").html("<span style=\"font-size:20px;\">"+tag1+"</span> 标签下共"+count+"篇");
    // $(".tag-result-count .count").text(count);
}
// 点击标签后显示相应的文章的函数
function tagResult(tagArr){
    var [tag1,tag2] = ["",""];
    tagInit(tagArr);
    $(".tags .tag").on("click",function(e){
        let count = 0;
        $(".tag-result-container").empty();
        tag1 = e.target.innerHTML;
        for(let i = 0;i < jsonRes.length;i ++){
            for(let j = 0;j < jsonRes[i].tag.length;j ++){
                tag2 = jsonRes[i].tag[j];
                if(tag1 === tag2){
                    count ++;
                    // console.log(tag1+" "+tag2);  console.log(jsonRes[i].title);
                    temp = `<a class="tag-result" target="_blank" href="../view/view.html?title=${jsonRes[i].title}"><h3>${jsonRes[i].title}</h3></a>`;
                    $(".tag-result-container").append(temp);                    
                }
            }
        }
        $(".tag-result-count").html("<span style=\"font-size:20px;\">"+tag1+"</span> 标签下共"+count+"篇");
    });
}


// 隐藏或显示搜索结果
// search.focus(function(){
//     $("#search-wrap .search-result").css('display','block');        
// });
// search.blur(function(){
//     $("#search-wrap .search-result").css('display','none');
// });

search.on('keyup',function(e){
    // console.log("--- keyup ---");
    var input = Escape(e.target.value);
    var [title,temp] = ["",""];
    if(input.length < 2){
        $(".search-result").empty();
        return;
    }
    var reg = new RegExp(".*(?="+input+").*","i");
    for(let i = 0;i < jsonRes.length;i ++){
        title = jsonRes[i].title;
        var b = reg.test(title);
        if(b){
            temp = temp + `<a target="_blank" href="../view/view.html?title=${title}">${title}</a>`
        }else{
            // temp = `<a>无搜索结果</a>`
        }
    }
    temp = temp + `<span class="close-search-result">关闭<span/>`;
    $(".search-result").html(temp);
})
function Escape(Str){
    var Reg = /(\.|\*|\\|\/|\||\[|\]|\(|\)|\{|\}|\^|\$|\+)/g;
    var s = Str.replace(Reg,function(a,b){
        return "\\"+b;
    })
    // console.log(s);
    return s
}

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

//------------------------------------------------------
//监听滚动事件，滚动等于或超过100px就给导航添加颜色，否则透明
$(window).scroll(function(e){
    let scrollY = $(window).scrollTop();

    if(scrollY >= 100){
        $(".changeColor").css({"background-color":"rgba(31,97,123, 1)"});
    }else{
        $(".changeColor").css({"background-color":"rgba(0, 0, 0, .0)"});
    }

})


// $(".tag").on("click",function(){
    // console.log($(".tag-wrap .tag:not(.js-tag)").is(":hidden"));

    // ($(".tag-wrap .tag:not(.js-tag)").is(":hidden") === true) ? $(".tag-wrap .tag:not(.js-tag)").show() : $(".tag-wrap .tag:not(.js-tag)").hide();
    
    // $(".js-tag").css({
        // "float":"left"
    // });
    // $(".tag-result-container").animate({
        // "height":"toggle"
        // "display":"block"
    // })
// })