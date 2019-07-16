'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');
var helmet      = require('helmet');
var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');
var MongoClient           = require('mongodb').MongoClient;
var dbHandler         = require('./dbHandler');
var stockDB;

var app = express();
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc:["'unsafe-inline'","'self'","code.jquery.com"]
  }
}));
app.use(helmet.noCache());
        
//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//prepare DB connection
var stockDB;
const CONNECTION_STRING = process.env.DB;
MongoClient.connect(CONNECTION_STRING,{useNewUrlParser:true},(err,client)=>{
  stockDB=dbHandler(client.db('stockQoutes'));
  //Routing for API 
apiRoutes(app,stockDB); 
})


 


//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
