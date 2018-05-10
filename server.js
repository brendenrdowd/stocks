const express = require('express'),
    app = express(),
    port=8001,
    bP = require('body-parser'),
    http = require('http'),
    request = require('request'),
    path=require('path');
require('dotenv').config();
let apiStr = "";
let stockObj = null;
const api_key = process.env.API_KEY;
console.log(process.env.API_KEY); 

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
    req.body.ticker ? data = req.body.ticker : data = "000"
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
    let call = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${apiStr}&apikey=${api_key}`
    request(call, function(error,response,body){
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
