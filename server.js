const express = require('express'),
    app = express(),
    port=8000,
    bP = require('body-parser'),
    http = require('http'),
    request = require('request'),
    path=require('path');
let apiStr;
let stockObj;

app.use(bP.urlencoded());
app.use(express.static(path.join(__dirname, "./views")));
app.use('/scripts', express.static(__dirname + '/node_modules/materialize-css/dist/'));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//routing
app.get('/', function(req,res){
    console.log("on render:", stockObj)
    res.render("index",{'stockObj':stockObj});
})
app.post('/search',function(req,res){
    console.log('req.body', req.body.ticker)
    let data = req.body.ticker;
    data = data.replace(/\+/g, ' ').replace(/,/gi,"").split(" ");
    console.log("clean data", data)
    apiStr = "";
    for(let ticker of data){
        ticker = ticker.trim();
        console.log("looping", ticker);
        if(ticker.length < 10 && ticker.length > 0){
            console.log("if-ing")
            if(apiStr.length < 1){
                apiStr = ticker;
            }else{
                apiStr = apiStr + ',' + ticker;
            }
            console.log("apiString",apiStr);
        }else{
            continue;
        }
    }
    console.log("hitting api");
    request(`https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${apiStr}&apikey=8X3HNXXJSGXLQ8XN`, function(error,response,body){
        if(!error && response.statusCode == 200){
            console.log("post api",JSON.parse(body));
            stockObj = JSON.parse(body);
            res.redirect('/');
        }else{
            console.log("error:",error)
        }
    })
})

app.listen(port, function(){
    console.log("listening")
})
