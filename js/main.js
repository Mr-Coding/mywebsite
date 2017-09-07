const next = $(".next");
const previous = $(".previous")
var dataCount = 0;
var onPage = 1;//记录当前所在页数
var allPage = 0;//记录总页数
var jsonToPages = {};//整理过后的json
var jsonRes = {};//原json数据
const PAGE_LIST = 8;//每一页可以显示几条目录


//------------------------
//ajax和json配合生成文章列表
$.ajax({
    url:"https://raw.githubusercontent.com/ching2016/MyWebsite/master/data/data.json",
    dataType: 'json',
    success:function(data){
        dataCount = data.length;
        // console.log(data);
        jsonToPages = PaginationsFactor(data,PAGE_LIST);
        jsonRes = data;
        $(".blogs .number").text(data.length);
        $(".tags .number").text(countTag(data));
        mekeList(jsonToPages,onPage);
    }
})
//创建文章目录
function mekeList(data,toPage){
    disabledBtn(onPage,allPage,next,previous);//检测按钮是否可以继续向下/上
    $("div").remove(".blog-info");//清空已有的目录，如果有的话
    let content = "";
    for(let i = 0;i < data[toPage].length;i ++){
        content = content + 
            `<div class="blog-info">
                <a class="title" href="view.html?title=${encodeURI(data[toPage][i].title+mekeTagUrl(data,i,toPage))}">${data[toPage][i].title}</a>
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
//创建get里的标签参数
function mekeTagUrl(data,i,toPage){
    let tagContent = "";
    for(var j = 0;j < data[toPage][i].tag.length;j ++){
        tagContent = tagContent + 
        `&tag${j+`=`+data[toPage][i].tag[j]}`
    }
    // console.log(tagContent);
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
    // console.log(j);
    return j;
}

//计算页数
function pages(data,pageCount){
    let count = data/pageCount;
    let allPages = 0;   //总页数
    if(data%pageCount){
        // console.log("不能整除 "+count+", "+parseInt(count+1));
        allPages = parseInt(count+1); //去掉小数点再自加1
    }else{
        // console.log("能整除 "+count);
        allPages = count;
    }
    return allPages;
}

//下一页
next.on("click",function(){
    // console.log("下一页");
    if(onPage != allPage){
        onPage ++;
        mekeList(jsonToPages,onPage);
        // console.log(onPage);
    }
})
//上一页
previous.on("click",function(){
    // console.log("上一页");
    if(onPage != 1){
        onPage --;
        mekeList(jsonToPages,onPage);
        // console.log(onPage);
    }
})

//检测按钮是否可以继续向下/上，不行则禁用相应按钮
// onPage:当前所在页数
// allPage:所有页数
// next & previous:上下按钮
function disabledBtn(onPage,allPage,next,previous){
    switch(onPage){
        case 1:
            previous.attr("disabled",true);
        break;
        case allPage:
            next.attr("disabled",true);
        break;
        default:
            next.attr("disabled",false);
            previous.attr("disabled",false);
        break
    }
}




$("#search").on('keyup',function(e){
    var input = Escape(e.target.value);
    var [title,temp] = ["",""];
    if(input.length < 2){
        $(".search-result").empty();
        // console.log("小于2");
        return;
    }
    // $(".search-result").show();
    var reg = new RegExp(".*(?="+input+").*","i");
    for(let i = 0;i < jsonRes.length;i ++){
        title = jsonRes[i].title;
        var b = reg.test(title);
        if(b){
            temp = temp + `<a target="_blank" href="view.html?title=${title}">${title}</a>`
        }else{
            // temp = `<a>无搜索结果</a>`
        }
    }
    // console.log(temp);
    $(".search-result").html(temp);
})
function Escape(Str){
    var Reg = /(\.|\*|\\|\/|\||\[|\]|\(|\)|\{|\}|\^|\$|\+)/g;
    var s = Str.replace(Reg,function(a,b){
        // console.log(a+"\n"+b);
        return "\\"+b;
    })
    // console.log(s);
    return s
}


// 创建标签列表
function countTag(data){
    var tagArr = [];
    var [isRepeatTag] = [false];
    var count = 0;
    for(let i = 0;i < data.length;i ++){
        for(let j = 0;j < data[i].tag.length;j ++){
            let tag = data[i].tag[j];
            for(var s in tagArr) {
                if(tagArr[s] === tag){
                    isRepeatTag =  true;
                }   
        　　}
            if(!isRepeatTag){
                tagArr.push(tag);
            }
        }
    }
    return tagArr.length;
}
// 给countTag函数来检查是否有重复标签的函数
function isRepeat(arr,str){
　　for(var i in arr) {
        if(arr[i] === str){
    　　　　return true;
        }   
　　}
　　return false;
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

// 
function debounce(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };