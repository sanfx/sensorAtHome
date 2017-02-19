google.charts.load('45', {
  callback: drawChart,
  packages:['corechart']
});

 (function (window)
 {
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(navigator.appVersion);
    window.jscd = { mobile: mobile };
 }(this));



function timeNow() {
  var d = new Date();
  amOrpm = "";
  hour = d.getHours();
  if (hour == 0) {
      hour = 12 ;
      amOrpm = " AM";
    }
  if (hour > 12){
    hour = hour - 12;
    amOrpm = " PM";
}else{
  amOrpm = " AM";
}


  m = (d.getMinutes()<10?'0':'') + d.getMinutes();
  return  hour + ':' + m + amOrpm;
}

function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Time');
  data.addColumn('number', 'Outdoor Temperature');
  data.addColumn('number', 'Drawing Room Temperature');
  data.addColumn('number', 'Outdoor Humidity');
  data.addColumn('number', 'Drawing Room Humidity');

  var nRows = 10;

  var lgndPos = 'bottom';

  if (!jscd.mobile){
    lgndPos = 'right';
    nRows = 20;
  }

  var options = {
    title: 'Outside temperature vs. Indoor Temperature & Outside Humidity vs. Indoor Humidity.',
    series: {
          // Gives each series an axis name that matches the Y-axis below.
          0: {axis: 'Temps'},
          1: {axis: 'Daylight'}
        },
    legend: { position: lgndPos},
    vAxis: {
        title: 'Temperature And Humidity',

        viewWindow: {
          max: 65,
           min: 5
        },
        gridlines: {
          title: "Temperature & Humidity",
            count: -1
        }
    },
    hAxis: {
        allowContainerBoundaryTextCufoff: true,
        title: 'Time',
        baseline: 5,
        logscale: true,
        baselineColor: '#00cc00',
        gridlines: {
          baseline: 5,
            count: -1,
            units: {
              'Time' : {format: [/*time*/]},
    'Outdoor Temperature': {format: ["&#8451"]},
    'Indoor Temperature': {format: [/*format strings here*/]},
    "humidity": {format: "%"},
    "humidity": {format: ["%"]},

  }
        },
    },
    animation: {
          // duration: 10,
          // easing: 'linear',
          startup: true
        },  
    tooltip: {isHtml: true},
    width: '100%',
    height: 500,
    pointSize: 1,
    enableInteractivity : true,
    explorer: { actions: ['dragToZoom', 'rightClickToReset'] }

  };

  var chart = new google.visualization.LineChart(document.getElementById('linechart_material'));
  ajaxCall();
  setInterval(ajaxCall, 60000); //60000 milliseconds == 1 minute
  function ajaxCall() {
    $.ajax({
      type: 'GET',
      crossDomain: true,
      dataType: 'json',
      data: {
        format: 'json'
      },
      url: 'http://192.168.1.156:8025/json',
    }).done(function (jsonData) {
      var chartData = jsonData.arduino;
      
      if (chartData.length > 0) {
        data.addRow([
          timeNow(),
          parseFloat(chartData[0].temperatureInC),
          parseFloat(chartData[1].temperatureInC),
          parseFloat(chartData[0].humidity),
          parseFloat(chartData[1].humidity),
          
        ]);
        if (data.getNumberOfRows() > nRows){
          data.removeRow(0);
        }
        entries = data.getNumberOfRows()
        nowRowsMsg =  "You are looking at last " + entries;
        if (entries == 1){
          nowRowsMsg+= " entry. Max allowed is " + nRows ;
        } else nowRowsMsg+= " entries. Max allowed is " + nRows ;
        document.getElementById("noOfRows").innerHTML = nowRowsMsg;
      }
      chart.draw(data, options);
    });
  }
}