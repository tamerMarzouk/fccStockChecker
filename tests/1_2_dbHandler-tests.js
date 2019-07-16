var dbHandler=require('../dbHandler');
var mongoClient=require('mongodb').MongoClient;
var chai=require('chai');
var assert=chai.assert;
var stocksDB;

suite('Testing the DB handler',()=>{
  setup('mongoDB connection',done=>{
     mongoClient.connect(process.env.DB, { useNewUrlParser: true },(err,client)=>{
     var db=client.db('stockQoutes');
       //console.log('->',dbHandler)
       stocksDB=dbHandler(db);
   
       assert.isNull(err,'Error :'+err);
       assert.exists(stocksDB.getStockLikes,'getStockLikes() missing!!');
       done();
    });
  });
  test('addStockLike()',done=>{
    stocksDB.addStockLike('MSFT','127.0.0.1').then(result=>{
      assert.exists(result)
      assert.isAbove(result.likes,1,'incorrect likes count')
      done();
    })
  });
  
  test('addStockLike() only one like per IP address',done=>{
    stocksDB.addStockLike('MSFT','127.0.0.1').then(result=>{
    assert.exists(result);
       assert.isAbove(result.likes,1,'incorrect likes count')
    done();
  })
  });
  
  test('getStockLikes() ',done=>{
    stocksDB.getStockLikes('MSFT').then((result)=>{
      assert.isAbove(result.likes,1,'incorrect likes for stock Quotes');
      done();
    });
  })
  
  test('getStockLikes() non existant stock',done=>{
    stocksDB.getStockLikes('zzzzzzzz').then((result)=>{
      //console.log(result)
      assert.equal(result.likes,0,'likes for non existant stock should be 0');
      done();
    });
  })
 
 
})
