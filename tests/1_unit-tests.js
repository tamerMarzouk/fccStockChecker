/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var assert= chai.assert;
var stockHandler = require('../controllers/stockHandler.js');


suite('Unit Tests', function(){

//none requiered
  test(' getStock',done=>{
    let stock='MSFT';
    stockHandler.getStock(stock).then(result=>{
      //console.log(result["Global Quote"]);
      assert.exists(result,'Result is undefined');
      assert.exists(result["ticker"],' Incorrect result returned!');
      assert.equal(result["ticker"],stock,'Missing requested stock!');
      assert.isAbove(result["close"],1,'Incorrect price type!');
      done();
    }).catch(ex=>{
      console.log('-------- Error:',ex)
    })
  })

  test(' getStock empty stock',done=>{
    stockHandler.getStock().then(result=>{
      assert.notExists(result,' Result should be undefined');
      done();
    }).catch(err=>{
      assert.exists(err,'Error should be returned!');
      done();
    })
  })
  
 
});