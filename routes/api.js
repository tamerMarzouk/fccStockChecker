/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
var stocksApi=require('../controllers/stockHandler')
module.exports = function (app,stockDB) {
  app.route('/api/stock-prices')
    .get(function (req, res){
    var clientIp=req.connection.remoteAddress;
    //console.log('--------caller IP address:',clientIp,req.ip,req.ips)
        if(clientIp=='127.0.0.1' || clientIp=='::1' ||clientIp=='::ffff:127.0.0.1'){
          //propably behind a proxy
          if(req.header('X-Forwarded-For')!=undefined) {
            console.log('---------->',req.header('X-Forwarded-For'))
            clientIp=req.header('X-Forwarded-For').split(",")[0];
          }
         
        }
   if(clientIp==undefined||clientIp==null){
     clientIp='127.0.0.1';
   }
      var stock=req.query.stock;
    var doLike=req.query.like;
    var action;
    if(doLike){
      action=stockDB.addStockLike;
    }else{
      action=stockDB.getStockLikes;
    }
    //console.log('---acction:',action)
 if(typeof stock=='string'){
      stocksApi.getStock(stock).then(result=>{
        //get the  likes for that stock from db
         action(stock,clientIp).then(likes=>{
          let stockResult=parseStock(result,likes);
          res.send({stockData:stockResult});
        })
      }
    )}else{
        //stock is an array
   console.log('-------------------',clientIp)
        
        //
        var stockResponse=[];
        var stockDBCalls=[];
        var stockAPIcalls=[];
        var stockAddLikes=[];
        for(let i=0;i<stock.length;i++){
          stockDBCalls.push(action(stock[i],clientIp));
          stockAPIcalls.push(stocksApi.getStock(stock[i]));
        }
        //Do the API calls and then remove likes property and add the rel_like property
        Promise.all([...stockAPIcalls,...stockDBCalls]).then((results)=>{
       console.log('------------all calls done',results)
        for(let i=0;i<results.length/2;i++){
          stockResponse.push(parseStock(results[i],results[i+2]))
        }
          //console.log(stockResponse);
          for(let i=0;i<stockResponse.length;i++){
          //  console.log(i,' ',stockResponse.length-i-1,' ',stockResponse[stockResponse.length-i-1])
          let otherLikes=stockResponse[stockResponse.length-i-1].likes;
          stockResponse[i].rel_likes=stockResponse[i].likes-otherLikes;
        } 
          //remove likes
         delete stockResponse[0].likes;
          delete stockResponse[1].likes;
         
          res.send({stockData:[...stockResponse]});
        });
      }
  
  });

  function parseStock(stockObj,likes){
    console.log(stockObj)
    let stockResult={};
          stockResult.stock=stockObj['ticker'];
          stockResult.price=stockObj['close'];
          stockResult.likes=likes.likes;
    return stockResult;
  }
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});
    
};
