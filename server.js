const express = require('express'),
    app = express(),
    port=8000,
    bP = require('body-parser'),
    http = require('http'),
    request = require('request'),
    path=require('path');
let apiStr;
let stockObj;
const api_key = process.env.apikey;

app.use(bP.urlencoded());
app.use(express.static(path.join(__dirname, "./views")));
app.use('/scripts', express.static(__dirname + '/node_modules/materialize-css/dist/'));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//routing
app.get('/', function(req,res){
    res.render("index",{'stockObj':stockObj});
})
app.post('/search',function(req,res){
    let data = req.body.ticker;
    data = data.replace(/\+/g, ' ').replace(/,/gi,"").split(" ");
    apiStr = "";
    for(let ticker of data){
        ticker = ticker.trim();
        if(ticker.length < 10 && ticker.length > 0){
            apiStr.length < 1 ? apiStr = ticker : apiStr = apiStr + ',' + ticker;
        }else{
            continue;
        }
    }
    request(`https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${apiStr}&apikey=${api_key}`, function(error,response,body){
        if(!error && response.statusCode == 200){
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
