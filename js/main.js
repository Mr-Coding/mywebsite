//ajax和json配合生成文章列表
$.ajax({
    url:"https://raw.githubusercontent.com/ching2016/MyWebsite/master/data/data.json",
    dataType: 'json',
    success:function(data){
        mekeList(data);
    }
})
function mekeList(data){
    let content = "";
    for(let i = 0;i < data.length;i ++){
        content = content + `<div class="blog-info">
                <a href="#" class="title">${data[i].title}</a>
                <p class="time">${data[i].time}</p> by <p class="author">${data[i].author}</p>
                </div>`;
    }
    $(".pagination-warp").before(content);
}

//监听滚动事件，滚动等于或超过100px就给导航添加颜色，否则透明
$(window).scroll(function(e){
    let scrollY = $(window).scrollTop();

    if(scrollY >= 100){
        $(".changeColor").css({"background-color":"#1F617B"});
    }else{
        $(".changeColor").css({"background-color":"rgba(0, 0, 0, .0)"});
    }

})