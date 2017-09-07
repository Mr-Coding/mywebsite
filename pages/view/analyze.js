(function(window){
    
    // console.log(window);
    function analyze(content){
        let [contents,loopStr] = [content.split(/\n/),""];
        let tempData = "";
        console.log(contents);
        for(let n = 0;n < contents.length;n ++){
            loopStr = contents[n];
            switch(true){
                case /^[\|].*[\|]$/.test(loopStr): //表格
                    var t = "";
                    [n,t] = Form(contents,n);
                    tempData = tempData + t;
                break
                case /^#{1,6}\s.*$/.test(loopStr): //标题
                    tempData = tempData + Title(loopStr);
                break;
                case /(\*\*.*\*\*)|(__.*__)/.test(loopStr): //粗体
                    tempData = tempData + Bold(loopStr);
                break;
                case /(_)([0-9a-zA-Z\(\)\[\]# ]+)(_)/.test(loopStr): //斜体
                    tempData = tempData + Italic(loopStr);
                break;
                case /\[.*\]\(.*\)/.test(loopStr): //链接
                    tempData = tempData + Link(loopStr);
                break;
                case /^-{3,}$/.test(loopStr): //分割线
                    tempData = tempData + Line(loopStr);
                break;
                default:
                    console.log("--- 都不匹配 ---");
                    tempData = tempData + tobeString(contents,n,n)[1];
                    // tempData = tempData + contents;
                break
            }
        // console.log("--tempData--:"+tempData);
        }
        console.log("tempData:");  console.log(tempData);
        return tempData;
    }
    
    function Line(content){
        console.log("---分割线---");
        let temp = `<hr/>`;
        return temp;
    }
    
    function Link(content){
        console.log("---链接---");
        let temp = ``;
        content.replace(/\[(.*)\]\((.*)\)/,function(match,a,b){
            console.log("match:"+match);  console.log("a:"+a+"\nb:"+b);
    
            let str = content.split(match);
            console.log("str:"+str);
            temp = analyze(str[0])+`<a href="${b}">${a}</a>`+analyze(str[1]);
        });
        return temp;
    }
    
    function Italic(content){
        console.log("---斜体---");
        let temp = ``;
        content.replace(/(_)([0-9a-zA-Z\(\)\[\]#:\/\/ ]*)(_)/,function(match,a,b,c){
            console.log("match:"+match);  console.log("a:"+a+"\nb:"+b+"\nc:"+c);
    
            let str = content.split(match);
            console.log("str:"+str);
            temp = analyze(str[0])+`<em>${analyze(b)}</em>`+analyze(str[1]);
        });
        return temp;
    }
    
    function Bold(content){
        console.log("---粗体---");
        let temp = ``;
        content.replace(/(\*\*|__)(_?([0-9a-zA-Z\(\)\[\]#:\/\/ ]*)_?)(\*\*|__)/,function(match,a,b,c,d){
            console.log("match:"+match);  console.log("a:"+a+"\nb:"+b+"\nc:"+c+"\nd:"+d);
    
            let str = content.split(match);
            console.log("str:"+str);        
            temp = analyze(str[0])+`<strong>${analyze(b)}</strong>`+analyze(str[1]);
        });
        return temp;
    }
    
    function Title(content){
        console.log("---标题---");
        let reg = /^(#{1,6}\s)(.*)$/g;
        let regResult = reg.exec(content);
        console.log(regResult);
        let temp = `
        <span><h${regResult[1].length}>${analyze(regResult[2])}</h${regResult[1].length}></span>
        `;
        return temp;
    }
    
    function Form(contents,index){
        console.log("---表格---");
        //reg:正则式,regResult:循环接受正则匹配结果
        let [reg,regResult] = [/[^\|]?[.*]?[^\|]+/g,""];
        let temp = `<table style="table-layout:fixed;word-break:break-all;margin: 10px;border-collapse: collapse;color: #333333;">`;
        let [regLength,loop] = [0,0];
        //content:循环接受contents数组里的结果,count:接受for循环里的索引进度
        let [content,count] = ["",0];
        if(contents.length === 1){//如果只有一次循环
            return [count,temp] = tobeString(contents,index);
        }
        for(let n = index;n < contents.length;n ++){
            loop ++;
            content = contents[n];
            if(loop === 2){
                console.log("第二次循环："+n+"  "+/\|{1}-+\|{1}-*/.test(content));
                if(/\|{1}-+\|{1}-*/.test(content)){
                    let regLength2 = 0;
                    while(regR = reg.exec(content)) {
                        regLength2 ++;
                    }
                    console.log("--regLength2--:"+regLength2);
                    if(regLength2 === regLength){
                        continue;
                    }else{
                        return [count,temp] = tobeString(contents,index,n);
                    }
                }else{
                    console.log("第二行语法不匹配："+content);
                    return [count,temp] = tobeString(contents,index,n);
                }
            }else{
                console.log("不是第二次循环："+n);
                if(loop < 2){
                    let bool = /[^\||-]?[.*]?[^\||-]+/.test(contents[n+1]);
                    // console.log("下一个---"+contents[n+1]+" "+bool);
                    if(bool){
                        return [count,temp] = tobeString(contents,index,n);
                    }
                }
            }
            if(!/^\|.*\|$/.test(content)){
                console.log("没有了..."+n);
                temp = temp+`</table>`;
                // console.log("temp:"+temp);
                return [n-1,temp];
            }
            // console.log("+++++ "+/^[\|].*[\|]$/.test(contents[n+1]));
            if(!/^[\|].*[\|]$/.test(contents[n+1])){
                temp = temp+`<tr style="border-bottom: none;">`;
            }else if(n === index){
                temp = temp+`<tr style="border-bottom: 2px #DDDDDD solid;">`;
            }else{
                temp = temp+`<tr style="border-bottom: 1px #DDDDDD solid;">`;
            }
    
            // let regLoop = regLength;
            let regLoop = 0;
            // regLength = 0;
            while(regResult = reg.exec(content)) {
                // regLength ++;
                if(n === index){
                    regLength ++;
                    console.log("首行:");
                    console.log(regResult);
                    temp = temp+`<th style="padding: 5px 8px;">`+analyze(regResult[0])+`</th>`;
                }else{
                    regLoop ++
                    temp = temp+`<td style="padding: 5px 8px;">`+analyze(regResult[0])+`</td>`;
                }
            }
            while(regLoop < regLength && n > index){
                console.log("空缺补全:\nregLength:"+regLength+" regLoop:"+regLoop);
                regLoop ++;
                temp = temp+`<td style="padding: 5px 8px;">`+`</td>`;            
            }
            temp = temp+`</tr>`;
            count = n+1;
        }
        console.log("解析结束..."+count);    
        temp = temp+`</table>`;    
        // console.log("temp:"+temp);
        return [count,temp];
    }
    
    function tobeString(contents,index=0,nowIndex=0){
        console.log("不匹配...");
        // let content = `<pre>`;
        let content = ``;
        let count = 0;
        for(let n = index;n < contents.length;n ++){
            content = content + contents[n];
            if(n === nowIndex){
                console.log("ToBeString finish...\n"+content);
                break;
            }
            count = n;
        }
        // content = content + `</pre>`;
        return [nowIndex,content];
    }

    window.S = window.Sinatra = analyze;

})(window)