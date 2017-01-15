var url = 'http://san.gotdns.ch:8025/json';

function removeTable(id)
  {
      var tbl = document.getElementById(id);
      if(tbl) tbl.parentNode.removeChild(tbl);
  }
  
  
document.addEventListener('DOMContentLoaded', function() {

  if (jscd.mobile){
    removeTable("gaugeTable")
    document.getElementById("gaugeTable").innerHTML = "";
  }

}, false);


(function (window) {
    {
        var unknown = '-';

        // browser
        var nVer = navigator.appVersion;

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);


    }

    window.jscd = {

        mobile: mobile,

    };
}(this));



if (jscd.mobile){


$(window).load(function(){
  
   setInterval(function() {
   jQuery.support.cors = true;
   $.ajax({
      url: url,
      data: {
         format: 'json'
      },
      error: function(jqXHR, textStatus, errorThrown) {
alert(textStatus + ': ' + errorThrown);
},
      dataType: 'json',
      crossDomain: true,
      success: function(data) {
         var sensorsData = data.arduino;
         renderHTML(sensorsData);
      },

      type: 'GET'
   });
}, 10000);
});
 }


function renderHTML(data)
{
  if (data){
   var sensorDataContainer = document.getElementById("displaySensorData");
   var htmlString = "<table id='headTable' style='width:100%'><tr><th>Location</th><th>Temperature</th><th>Humidity</th></tr>";
   for (i = 0; i < data.length; i++){
      htmlString += "<tr align='center'><td>"+ data[i].location + "</td><td>" + data[i].temperatureInC + "&deg;C/ " + data[i].temperatureInF + "&deg;F </td> <td> " + data[i].humidity + "%</td></tr>";
   }
   htmlString += "</table>"
   // sensorDataContainer.insertAdjacentHTML('beforeend', htmlString);
   sensorDataContainer.innerHTML = htmlString;
   }
}

//------------- Google Gauge -------------------//

// global variables
var chart, humidityChart, data, humidityData;
// maximum value for the gauge
var max_gauge_value = 70;
// name of the gauge
var gauge_name = 'Temperature';
var outTemp, drwngRomTemp, outHumidity, drwRomHumid;

var hoptions = {
  min: 0,
  max: 100,
          redFrom: 90, redTo: 100,
          yellowFrom:75, yellowTo: 90,
          minorTicks: 5
        };

// load the google gauge visualization
  google.load('visualization', '1', {'packages':['gauge']});
  google.setOnLoadCallback(initChart);

  // display the data
  function displayData(outTemp, drwngRomTemp, outHumidity, drwRomHumid) {

    chart.draw(data, options);
    data.setValue(0, 0, gauge_name);
    data.setValue(0, 1, outTemp);
    data.setValue(1, 0, gauge_name);
    data.setValue(1, 1, drwngRomTemp);
    humidityChart.draw(humidityData, hoptions);
    humidityData.setValue(0, 0, "Humidity");
    humidityData.setValue(0, 1, outHumidity);
    humidityData.setValue(1, 0, "Humidity");
    humidityData.setValue(1, 1, drwRomHumid);

  }

// load the data
function loadData() {
      // get the data from arduino
      $.getJSON(url, function(data) {
        if (data)
          {
          // get the data point
          outTemp = data.arduino[0].temperatureInC;
          drwngRomTemp = data.arduino[1].temperatureInC;
          outHumidity = data.arduino[0].humidity;
          drwRomHumid = data.arduino[1].humidity;
          }
       
        // p = Math.round((p / max_gauge_value) * 100);
        displayData(outTemp, drwngRomTemp, outHumidity, drwRomHumid);
        

      });
  }

  // initialize the chart
  function initChart() {

    data = new google.visualization.DataTable();
    data.addColumn('string', 'Label');
    data.addColumn('number', 'Value');

    data.addRows(2);

    humidityData = new google.visualization.DataTable();
    humidityData.addColumn('string', 'Label');
    humidityData.addColumn('number', 'Value');

    humidityData.addRows(2);

    chart = new google.visualization.Gauge(document.getElementById('gauge_div'));
    humidityChart = new google.visualization.Gauge(document.getElementById('humidity_gauge_div'));
    options = { 

      greenFrom: 10,
      greenTo: 29,
      redFrom: 41,
      redTo: 70,
      yellowFrom:30,
      yellowTo: 40,
      minorTicks: 5 ,
      min: -20,
      max: 70,
      greenColor: '#CCFFCC',
      yellowColor: '#FFFFCC',
      redColor: '#F78181'
    };

    loadData();

    // load new data every 10 seconds
    setInterval('loadData()', 10000);
  }


