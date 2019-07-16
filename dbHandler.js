const databaseName='StockLikes';
module.exports=function(database){
  this.getStockLikes=function(stock){
    return new Promise((resolve,reject)=>{
      database.collection(databaseName).aggregate([{$match:{stock:stock}},{$project:{_id:1,stock:1,likes:{$size:"$likedIps"}}}],(err,result)=>{
     
        if(err){
          reject(err);
          return;
        }
        result.toArray((err,data)=>{
          //console.log(err,data)
          if(err) {
            reject(err);
            return;
          }
          if(data.length==0){
            resolve({stock:stock,likes:0});
            return;
          }
          resolve(data[0]);
        })
         
      });    
    })
  }
  this.addStockLike=function(stock,ip){
    return new Promise((resolve,reject)=>{
      if(ip=='undefined' || ip==null){
       // console.log('-------------- ip address in addStockLike is  :',stock,ip);
        reject ('missing ip address!')
        return;
      }
      database.collection(databaseName).findOneAndUpdate({stock:stock},{$addToSet:{likedIps:ip}},{upsert:true,returnNewDocument:true},(err,result)=>{
       //console.log(result)
        if(err){
          reject(err);
          return;
        }
        let stockObj=result.value;
        stockObj.likes=stockObj.likedIps.length;
        delete stockObj.likedIps;
        resolve(stockObj);
      });
    });
  }
  return this;
}
