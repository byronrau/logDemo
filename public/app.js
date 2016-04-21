var app = angular.module('badge', ['ui.router', 'highcharts-ng']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/home.html',
      controller: 'ntCtrl'
    })
  $urlRouterProvider.otherwise('/');
});


app.controller('ntCtrl', ['$scope', '$http', '$document', function($scope, $http, $document) {
  var groupingUnits = [
    [
      'minute', // unit name
      [60] // allowed multiples
    ],
    [
      'hour', [24]]
  ];
  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });
  $scope.chartConfig = {
    options: {
      chart: {
        zoomType: 'x'
      },
      rangeSelector: {
        enabled: true,
        buttons: [
          {
            type:'second',
            count: 900,
            text: '15m'
          },
          {
            type:'second',
            count: 1800,
            text: '30m'
          },
          {
            type: 'minute',
            count: 60,
            text: '1h'
          },
          {
            type: 'all',
            text: 'All'
          }]
        },
      navigator: {
        enabled: true
      },
      legend: {
        enabled: true,
        align: 'right'
      }
    },
    plotOptions:{
      series:{
        dataGrouping: {
          enabled:false
        }
      }
    },
    series: [],
    title: {
        text: 'Badge'
    },
    useHighStocks: true
  };

  $scope.scollToLog = function(time){
    // console.log(time.toString().slice(0,-3));
    var timeMinutes = time.toString().slice(0,-3);
    // console.log('time', timeMinutes);
    var container = $('.log'),
        scrollTo = $('.'+timeMinutes);

    if(scrollTo !== undefined){
      // container.scrollTop(
      //   scrollTo.offset().top - container.offset().top + container.scrollTop()
      // );
      container.animate({
        scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
      });
    }

  }

  $scope.addTimeClass = function(line) {
    // return line.utc;
    var classStr = line.utc;
    if(line.line.match(' Low SNR Event')) {
      classStr += ' snr';
    }
    if(line.line.match(' Associated with AP')) {
      classStr += ' assoc';
    }
    if(line.line.match(' Ack')) {
      classStr += ' ack';
    }
    if(line.line.match(' Ping')) {
      classStr += ' ping';
    }
    if(line.line.match('disassociation')){
      classStr += ' disassoc';
    }
    if(line.line.match('scan results event')){
      classStr += ' scan';
    }
    // console.log('class logline', line.utc);
    return classStr;
  }

  $scope.pings = function() {
    $scope.loading = true;
    $http.get('/read', {
    }).then(function(resp) {
      var dataArr = [];
      // console.log('resp', resp);
      resp.data.forEach(function(ping){
        // var tuple = [Date.parse(ping.time), ping.val];
        var tuple = [moment(ping.time, 'MM/DD/YY HH:mm:ss:SSS').valueOf(), ping.val];
        dataArr.push(tuple);
      });
      $scope.chartConfig.series.push ({
        type: 'column',
        name: 'Pings',
        data: dataArr,
        point: {
          events: {
            click: function () {
              $scope.scollToLog(this.x);
            }
          }
        }
      });
      // console.log('dataArr', dataArr);
    }, function(err){
      alert('Error getting data, please try again.')
      $scope.loading = false;
    });
  }
  $scope.acks = function() {
    $scope.loading = true;
    $http.get('/acks', {
    }).then(function(resp) {
      var dataArr = [];
      // console.log('resp', resp);
      resp.data.forEach(function(ping){
        // var tuple = [Date.parse(ping.time), ping.val];
        var tuple = [moment(ping.time, 'MM/DD/YY HH:mm:ss:SSS').valueOf(), ping.val];
        dataArr.push(tuple);
      });
      $scope.chartConfig.series.push ({
        type: 'column',
        name: 'Acks',
        data: dataArr,
        point: {
          events: {
            click: function () {
              $scope.scollToLog(this.x);
            }
          }
        }
      });
      // console.log('dataArr', dataArr);
    }, function(err){
      alert('Error getting data, please try again.')
      $scope.loading = false;
    });
  }

  $scope.assocs = function() {
    $scope.loading = true;
    $http.get('/assocs', {
    }).then(function(resp) {
      var dataArr = [];
      // console.log('resp', resp);
      resp.data.forEach(function(ping){
        var obj = {
          // x: Date.parse(ping.time)
          x: moment(ping.time, 'MM/DD/YY HH:mm:ss:SSS').valueOf(),
          title: 'A',
          text: ping.line.split(' ').slice(5).join(' ')
        }
        dataArr.push(obj);
      });
      $scope.chartConfig.series.push ({
        type: 'flags',
        name: 'Assocs',
        data: dataArr,
        point: {
          events: {
            click: function () {
              $scope.scollToLog(this.x);
            }
          }
        },
        onSeries: 3,
        shape: 'circlepin'
      });
      // console.log('dataArr', dataArr);
    }, function(err){
      alert('Error getting data, please try again.')
      $scope.loading = false;
    });
  }

  $scope.disassocs = function() {
    $scope.loading = true;
    $http.get('/disassocs', {
    }).then(function(resp) {
      var dataArr = [];
      console.log('disassocs', resp);
      resp.data.forEach(function(ping){
        // console.log('Date',Date.parse(ping.time));
        // console.log('Moment',moment(ping.time, 'MM/DD/YY HH:mm:ss:SSS').valueOf());
        var obj = {
          // x: Date.parse(ping.time),
          x: moment(ping.time, 'MM/DD/YY HH:mm:ss:SSS').valueOf(),
          title: 'D',
          text: ping.line.split(' ').slice(2).join(' ')
        }
        dataArr.push(obj);
      });
      $scope.chartConfig.series.push ({
        type: 'flags',
        name: 'Assocs',
        data: dataArr,
        point: {
          events: {
            click: function () {
              $scope.scollToLog(this.x);
            }
          }
        },
        onSeries: 3,
        shape: 'squarepin',
        width: 16,
          style: {
            color: 'red'
          },
      });
      // console.log('dataArr', dataArr);
    }, function(err){
      alert('Error getting data, please try again.')
      $scope.loading = false;
    });
  }

  $scope.lowsnr = function() {
    $scope.loading = true;
    $http.get('/lowsnr', {
    }).then(function(resp) {
      var dataArr = [];
      // console.log('resp', resp);
      resp.data.forEach(function(ping){
        // var tuple = [Date.parse(ping.time), ping.val];
        var tuple = [moment(ping.time, 'MM/DD/YY HH:mm:ss:SSS').valueOf(), ping.val];
        dataArr.push(tuple);
      });
      $scope.chartConfig.series.push ({
        type: 'scatter',
        name: 'Lowsnr',
        data: dataArr,
        point: {
          events: {
            click: function () {
              $scope.scollToLog(this.x);
            }
          }
        }
      });
      // console.log('dataArr', dataArr);
    }, function(err){
      alert('Error getting data, please try again.')
      $scope.loading = false;
    });
  }


  $scope.loglines = function() {
    $scope.loading = true;
    $http.get('/all', {
    }).then(function(resp) {
      $scope.loglines = resp.data;
      $scope.loglines.forEach(function(line){
        // line.utc = Date.parse(line.time).toString().slice(0,-3);
        line.utc = moment(line.time, 'MM/DD/YY HH:mm:ss:SSS').valueOf().toString().slice(0,-3);

      });

      console.log('loglines', $scope.loglines);

    }, function(err){
      alert('Error getting data, please try again.')
      $scope.loading = false;
    });
  }


  $scope.pings();
  $scope.acks();
  $scope.loglines();
  $scope.assocs();
  $scope.lowsnr();
  $scope.disassocs();

}]);