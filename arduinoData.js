

$.ajax({
      type: 'GET',
      crossDomain: true,
      dataType: 'json',
      data: {
        format: 'json'
      },
      url: 'https://jsonip.com/',
    }).done(function (jsonIp) {
      console.log(jsonIp["ip"]);
      // document.getElementById("myIpAddr").innerHTML = userip;
    });


//get the IP addresses associated with an account
function getIPs(callback){
    var ip_dups = {};

    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking using an iframe
    if(!RTCPeerConnection){
        //NOTE: you need to have an iframe in the page right above the script tag
        //
        //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
        //<script>...getIPs called in here...
        //
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
            || win.mozRTCPeerConnection
            || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }

    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
    };

    var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate){
        //match just the IP address
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        var ip_addr = ip_regex.exec(candidate)[1];

        //remove duplicates
        if(ip_dups[ip_addr] === undefined)
            callback(ip_addr);

        ip_dups[ip_addr] = true;
    }

    //listen for candidate events
    pc.onicecandidate = function(ice){

        //skip non-candidate events
        if(ice.candidate)
            handleCandidate(ice.candidate.candidate);
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function(result){

        //trigger the stun server request
        pc.setLocalDescription(result, function(){}, function(){});

    }, function(){});

    //wait for a while to let everything done
    setTimeout(function(){
        //read candidate info from local description
        var lines = pc.localDescription.sdp.split('\n');

        lines.forEach(function(line){
            if(line.indexOf('a=candidate:') === 0)
                handleCandidate(line);
        });
    }, 1000);
}
var msg = "";
var url = "";
try {
  //Test: Print the IP addresses into the console
  getIPs(function(ip){
    url = 'http://192.168.1.156:8025/json';
    
    msg = "Using URL : " + url; 
    // console.log(msg);
  });
  // console.log(msg);
}
catch(err){
  console.log(err);
  url = 'http://san.gotdns.ch:8025/json';
  msg = "Using URL : " + url;
}
console.log(msg);


// if userip == "192.168.1.156"

// var url = 'http://192.168.1.156:8025/json';
// var url = 'http://san.gotdns.ch:8025/json';

jQuery.support.cors = true;

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


 (function (window)
 {
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(navigator.appVersion);
    window.jscd = { mobile: mobile };
 }(this));



if (jscd.mobile){

$(window).load(function(){
  
   setInterval(function() {
   
   $.ajax({
      url: url,
      data: {
         format: 'json'
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus + ': ' + errorThrown);
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
var soilMoisture_pot1;

var hoptions = {
  min: 0,
  max: 100,
          redFrom: 90, redTo: 100,
          yellowFrom:75, yellowTo: 90,
          minorTicks: 5
        };

var options = { 

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

function displaySoilMoistOfPot(soilMoisture_pot1){
  // document.getElementById("displaySensorData").innerHTML = soilMoisture_pot1;
  pot1SoilMoistChart.draw(soilMoisture_data, hoptions);
  soilMoisture_data.setValue(0, 0, "Pot 1");
  soilMoisture_data.setValue(0, 1, soilMoisture_pot1);

  }

// load the data
function loadData() {
  $.ajax({
    type: "GET",
    crossDomain: true,
    dataType: "json",
    data: {
      format: 'json'
    },
    url: url,
    success: function(data) {
      // data = JSON.stringify(jsondata, undefined, 2);
      if (data)
      {
        // get the data point
        outTemp = data.arduino[0].temperatureInC;
        drwngRomTemp = data.arduino[1].temperatureInC;
        outHumidity = data.arduino[0].humidity;
        drwRomHumid = data.arduino[1].humidity;
        soilMoisture_pot1 = data.pots[0].pot1;
      }
       
      // p = Math.round((p / max_gauge_value) * 100);
      displayData(outTemp, drwngRomTemp, outHumidity, drwRomHumid);
      displaySoilMoistOfPot(soilMoisture_pot1);
    }

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

    soilMoisture_data = new google.visualization.DataTable();
    soilMoisture_data.addColumn('string', 'Label');
    soilMoisture_data.addColumn('number', 'Value');

    soilMoisture_data.addRows(2);

    chart = new google.visualization.Gauge(document.getElementById('gauge_div'));
    humidityChart = new google.visualization.Gauge(document.getElementById('humidity_gauge_div'));
    pot1SoilMoistChart = new google.visualization.Gauge(document.getElementById('pot1'));



    loadData();

    // load new data every 10 seconds
    setInterval('loadData()', 5000);
}


