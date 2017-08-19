const next = $(".next");
const previous = $(".previous")
var dataCount = 0;
var toPages = 1;//记录当前所在页数
var allPage = 0;//记录总页数
var jsonToPages = {};//整理过后的json

//------------------------
//ajax和json配合生成文章列表
$.ajax({
    url:"https://raw.githubusercontent.com/ching2016/MyWebsite/master/data/data.json",
    dataType: 'json',
    success:function(data){
        dataCount = data.length;
        // console.log(data);
        jsonToPages = PaginationsFactor(data,5);
        mekeList(jsonToPages,toPages);
    }
})
//创建文章目录
function mekeList(data,toPage){
    $("div").remove(".blog-info");//清空已有的目录，如果有的话
    let content = "";
    for(let i = 0;i < data[toPage].length;i ++){
        content = content + 
            `<div class="blog-info">
                <a href="#" class="title">${data[toPage][i].title}</a>
                <p class="time">${data[toPage][i].time}</p> by <p class="author">${data[toPage][i].author}</p>
                <p class="tag-wrap">` +
                    mekeTagList(data,i,toPage)+
                `</p>
            </div>`;
    }
    $(".pagination-warp").before(content);
}
//创建文章目录里的标签
function mekeTagList(data,i,toPage){
    let tagContent = "";
    for(let j = 0;j < data[toPage][i].tag.length;j ++){
        tagContent = tagContent + 
            `<a href="#" class="tag">${data[toPage][i].tag[j]}</a>`
    }
    return tagContent;
}

//--------------------------------------------
// json数据分组，每1组pageCount个
// data:json原数据，pageCount:要分的页数，默认10
function PaginationsFactor(data,pageCount = 10){
    const pLength = pages(data.length,pageCount); //页数
    allPage = pLength; //传出总页数...
    var j = {};
    var content = []; //临时接收从原json里拆分出的数据
    var flag = 0; //记录已读取到的目录
    for(let n = 0;n <pLength;n ++){
        for(var i = flag;i < pageCount+flag;i ++){
            if(data[i] === undefined){ //如果不足pageCount个及检测到undefined就break
                break;
            }
            content.push(data[i]);
            if(flag === data.length){
                break;
            }
            if(i+1 === pageCount+flag){
                // console.log("结束...");
                flag = i+1;  
                break;      
            }
        }
        j[n+1] = content;
        content = []; //清空临时数组
    }
    console.log(j);
    return j;
}

//计算页数
function pages(data,pageCount){
    let count = data/pageCount;
    let allPages = 0;   //总页数
    if(data%pageCount){
        console.log("不能整除 "+count+", "+parseInt(count+1));
        allPages = parseInt(count+1); //去掉小数点再自加1
    }else{
        console.log("能整除 "+count);
        allPages = count;
    }
    return allPages;
}

//下一页
next.on("click",function(){
    console.log("下一页"+allPage);
    if(toPages != allPage){
        toPages ++;
        mekeList(jsonToPages,toPages);
        console.log(toPages);
    }
})
//上一页
previous.on("click",function(){
    console.log("上一页");
    if(toPages != 1){
        toPages --;
        mekeList(jsonToPages,toPages);
        console.log(toPages);
    }
})



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