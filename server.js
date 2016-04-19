var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
// var User = require('./userModel.js');
var morgan = require('morgan');
// var cookieParser = require('cookie-parser');
// var session = require('express-session');
var fs = require('fs');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
// app.use(cookieParser());
app.use(bodyParser.json());
// app.use(session({cookie: { path: '/', httpOnly: true, maxAge: null}, secret:'mysecret', resave: false, saveUninitialized: true}));
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// var io = require('socket.io').listen(app.listen(process.env.PORT || 9000));

// require('./routes.js')(app, express, io);

app.get('/read', function(req, res){
  var results =[];
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('1.txt')
  });

  lineReader.on('line', function (line) {
    var obj = {};
    if(line.match(' Ping')){
      // console.log('Line from file:', line);
      var lineArr = line.split(' ');
      obj.time = lineArr[0] + ' ' + lineArr[1];
      obj.val = 1;
      obj.line = lineArr.slice(2).join(' ');
      results.push(obj);
    }
  });
  lineReader.on('close', function(){
    res.send(results);
  });
});

app.get('/acks', function(req, res){
  var results =[];
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('1.txt')
  });

  lineReader.on('line', function (line) {
    var obj = {};
    if(line.match(' Ack')){
      // console.log('Line from file:', line);
      var lineArr = line.split(' ');
      obj.time = lineArr[0] + ' ' + lineArr[1];
      obj.val = 1;
      obj.line = lineArr.slice(2).join(' ');
      results.push(obj);
    }
  });
  lineReader.on('close', function(){
    res.send(results);
  });
});

app.get('/assocs', function(req, res){
  var results =[];
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('1.txt')
  });

  lineReader.on('line', function (line) {
    var obj = {};
    if(line.match(' Associated with AP')){
      // console.log('Line from file:', line);
      var lineArr = line.split(' ');
      obj.time = lineArr[0] + ' ' + lineArr[1];
      obj.val = 5;
      obj.line = lineArr.slice(2).join(' ');
      results.push(obj);
    }
  });
  lineReader.on('close', function(){
    res.send(results);
  });
});

app.get('/lowsnr', function(req, res){
  var results =[];
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('1.txt')
  });

  lineReader.on('line', function (line) {
    var obj = {};
    if(line.match(' Low SNR Event')){
      // console.log('Line from file:', line);
      var lineArr = line.split(' ');
      obj.time = lineArr[0] + ' ' + lineArr[1];
      obj.val = 2;
      obj.line = lineArr.slice(2).join(' ');
      results.push(obj);
    }
  });
  lineReader.on('close', function(){
    res.send(results);
  });
});



app.get('/all', function(req, res){
  var results =[];
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('1.txt')
  });

  lineReader.on('line', function (line) {
    var obj = {};
    // console.log('Line from file:', line);
    var lineArr = line.split(' ');
    obj.time = lineArr[0] + ' ' + lineArr[1];
    obj.val = 1;
    obj.line = lineArr.join(' ');
    results.push(obj);
    // results.push(line);
  });
  lineReader.on('close', function(){
    res.send(results);
  });
});




app.listen(3000);