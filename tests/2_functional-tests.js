/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
        let stock='GOOG';
       chai.request(server)
        .get('/api/stock-prices?stock='+stock)
        .end(function(err, res){
         let stockObj=res.body;
         console.log('here---------------',res,stockObj)
          assert.equal(res.status,200);
         //result object should be like {"stockData":{"stock":"GOOG","price":"786.90","likes":1}}
         assert.equal(stockObj.stockData.stock,stock,'incorrect stock option returned!');
         assert.isAbove(stockObj.stockData.price,1,'incorrect stock price returned!');
         assert.isAbove(stockObj.stockData.likes,-1,'incorrect stock likes!');
          
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        let stock='MSFT';
        chai.request(server)
        .get('/api/stock-prices?stock='+stock+'&like=true')
        .end((err,res)=>{
          let stockObj=res.body;
          assert.equal(res.status,200);
          assert.isAtLeast(stockObj.stockData.likes,1,' likes should be at least 1');
          done();
        })
      });
      
      test('1 stock with like again(ensure likes arent double counted)', function(done) {
        let stock='MSFT';
        chai.request(server)
        .get('/api/stock-prices?stock='+stock+'&like=true')
        .end((err,res)=>{
          let stockObj=res.body;
          assert.equal(res.status,200);
          assert.isAbove(stockObj.stockData.likes,1,' likes should be equal 1');
          done();
        })
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&stock=MSFT')
        .end((err,res)=>{
          console.log(res.body)
          assert.equal(res.status,200);
          assert.isArray(res.body.stockData,'Must return an array');
          assert.exists(res.body.stockData[0].rel_likes)
          assert.exists(res.body.stockData[1].rel_likes)
          done();
        })
        
        
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.isArray(res.body.stockData,'Must return an array');
          assert.exists(res.body.stockData[0].rel_likes)
          assert.exists(res.body.stockData[1].rel_likes)
          done();
        })
      });
      
    });

});
