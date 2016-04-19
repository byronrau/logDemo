var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());

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




app.listen(process.env.PORT || 3000);