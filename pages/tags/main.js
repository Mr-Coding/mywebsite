var jsonRes = {};

$.ajax({
    url:"https://raw.githubusercontent.com/ching2016/MyWebsite/master/data/data.json",
    dataType: 'json',
    success:function(data){
        console.log(data);
        jsonRes = data;
    }
})

$("#search").on('keyup',function(e){
    console.log("--- keyup ---");
    var input = Escape(e.target.value);
    var [title,temp] = ["",""];
    if(input.length < 2){
        $(".search-result").empty();
        console.log("小于2");
        return;
    }
    var reg = new RegExp(".*(?="+input+").*","i");
    for(let i = 0;i < jsonRes.length;i ++){
        title = jsonRes[i].title;
        var b = reg.test(title);
        if(b){
            temp = temp + `<a target="_blank" href="../../view.html?title=${title}">${title}</a>`
        }else{
            // temp = `<a>无搜索结果</a>`
        }
    }
    console.log(temp);
    $(".search-result").html(temp);
})
function Escape(Str){
    var Reg = /(\.|\*|\\|\/|\||\[|\]|\(|\)|\{|\}|\^|\$|\+)/g;
    var s = Str.replace(Reg,function(a,b){
        console.log(a+"\n"+b);
        return "\\"+b;
    })
    // console.log(s);
    return s
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