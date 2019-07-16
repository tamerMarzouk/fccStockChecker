const https=require('https');
const apiURL=process.env.STOCKAPI;
var stocksDB;

this.getStock=function (stock){

  return new Promise((resolve,reject)=>{
    if(stock==''||stock==undefined) {
      reject ('Please supply stock code');
    }
    let api=apiURL.replace('%STOCK%',stock);
    var result='';
    https.get(api,resp=>{
      if(resp.statusCode==404){
        reject('Not found');
      }
      resp.on('data',d=>{
        result+=d;
      });
      resp.on('end',()=>{
        if(resp.statusCode==404){
          return;
        }
        result=JSON.parse(result);
        //console.log(result);
        result["price"]=parseFloat(result["close"]);
        resolve(result);
      });
    }).on('error',err=>{
      reject(err);
    });
  });
}
module.export=this;