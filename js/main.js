var blogs = {};

$.ajax({
    url:"https://raw.githubusercontent.com/ching2016/MyWebsite/master/data/data.json",
    dataType: 'json',
    success:function(data){
        blogs = data;
        mekeList(blogs);
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