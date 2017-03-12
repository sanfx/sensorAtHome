// var url = 'http://san.gotdns.ch:8095/json';

hostName = window.location.hostname;
if ($('#dbBtn:not(:visible)'))  {
        url ="http://" + hostName + "/arduino/directEncode.php";
  } else 
  {
        url = 'http://' + hostName.replace('.3', '.156');  + ':8095/json';
  }

// console.log('http://' + hostName + " changed to " + url);
$().ready(function(){
   setInterval(function() {

    // if ($('#dbBtn:not(:visible)'))  {
    var liveBtn = document.getElementById("liveBtn");
    var dbBtn  = document.getElementById("dbBtn");
    if (liveBtn.style.display !== 'none') {
            url ="http://" + hostName + "/arduino/directEncode.php";
      } else 
      {
            url = 'http://' + hostName.replace('.3', '.156')  + ':8095/json';
      }
      console.log("URL: " + url);
      // console.log('http://' + hostName + " changed to " + url);
      getData();

// }, 60000);
}, 3000);
});


// call directly without waiting a second.
getData();


function displayDataInDiv(data){
  var liveBtn = document.getElementById("liveBtn");
  var dbBtn  = document.getElementById("dbBtn");
    if (liveBtn.style.display !== 'none') {
        console.log("coming from database");
        document.getElementById("location").innerHTML = "Outdoor";
        document.getElementById("Outtemp").innerHTML = "Temperature: " + data.out_temperature + "&deg;C";
        document.getElementById("Outhumid").innerHTML = "Humidity: " + data.out_humidity + "%" ;
        document.getElementById("dewPoint").style.display = 'none';
        document.getElementById("OutheadIndex").style.display = 'none';
        getUvIndex(data.millieVolt);
        document.getElementById("inlocation").innerHTML = "Drawing Room";
        document.getElementById("intemp").innerHTML = "Temperature: " + data.drwngRoom_temperature + "&deg;C";
        document.getElementById("inhumid").innerHTML = "Humidity: " + data.drwngRoom_humidity + "%" ;
        document.getElementById("indewPoint").style.display = 'none';
        document.getElementById("inheadIndex").style.display = 'none';
      }
      else { // Live data display
        console.log("coming live from Arduino.")
        var tempHumidData = data.arduino;

       document.getElementById("location").innerHTML = tempHumidData[0].location;
       document.getElementById("Outtemp").innerHTML = "Temperature: " + tempHumidData[0].temperatureInC + "&deg;C/ " + tempHumidData[0].temperatureInF + "&deg;F " ;
       document.getElementById("Outhumid").innerHTML = "Humidity: " + tempHumidData[0].humidity + "%" ;
        document.getElementById("dewPoint").style.display = 'block';
        document.getElementById("OutheadIndex").style.display = 'block';
       document.getElementById("dewPoint").innerHTML = "Dew Point: " + tempHumidData[0].dewPoint_in_Cel + "&deg;C/ " + tempHumidData[0].dewPoint_in_Fahr + "&deg;F " ;
       document.getElementById("OutheadIndex").innerHTML = "Feels like " + tempHumidData[0].heat_index_in_Cel + "&deg;C/ " +  tempHumidData[0].heat_index__in_Fahr + "&deg;F " ;
       getUvIndex(tempHumidData[0].UVSig);
       // renderHTML(tempHumidData);
       document.getElementById("inlocation").innerHTML = tempHumidData[1].location;
       document.getElementById("intemp").innerHTML = "Temperature: " + tempHumidData[1].temperatureInC + "&deg;C/ " + tempHumidData[1].temperatureInF + "&deg;F " ;
       document.getElementById("inhumid").innerHTML = "Humidity: " + tempHumidData[1].humidity + "%" ;
        document.getElementById("indewPoint").style.display = 'block';
        document.getElementById("inheadIndex").style.display = 'block';
       document.getElementById("indewPoint").innerHTML = "Dew Point: " + tempHumidData[1].dewPoint_in_Cel + "&deg;C/ " + tempHumidData[1].dewPoint_in_Fahr + "&deg;F " ;
       document.getElementById("inheadIndex").innerHTML = "Feels like " + tempHumidData[1].heat_index_in_Cel + "&deg;C/ " +  tempHumidData[1].heat_index__in_Fahr + "&deg;F " ;
      }
}


function showHideLiveDbBtns(){
  var liveBtn = document.getElementById("liveBtn");
  var dbBtn  = document.getElementById("dbBtn");
    if (liveBtn.style.display !== 'none') {
        dbBtn.style.display = 'block';
        liveBtn.style.display = 'none';
    } else
    {

        liveBtn.style.display = 'block';
        dbBtn.style.display = 'none';
    }
    getData();
}


function getData(){
  $.ajax(
    {
     url: url,
     data: {
        format: 'json'
     },
     error: function(jqXHR, textStatus, errorThrown)
     {
       console.log(textStatus + ': ' + errorThrown);
     },
     dataType: 'json',
     crossDomain: true,
     success: function(data) {
      displayDataInDiv(data);
     },
      type: 'GET'
   }
   );

}

function renderHTML(data)
{
  if (data){

   var dataContainer = document.getElementById("displaySensorData");
   var htmlString = "<table id='headTable' style='width:100%'><tr><th>Location</th><th>Temperature</th><th>Humidity</th></tr>";
   for (i = 0; i < data.length; i++){
      htmlString += "<tr align='center'><td>"+ data[i].location + "</td><td>" + data[i].temperatureInC + "&deg;C/ " + data[i].temperatureInF + "&deg;F </td> <td> " + data[i].humidity + "%</td></tr>";
   }
   htmlString += "</table>"
   dataContainer.innerHTML = htmlString;
   }
}

function getUvIndex(miliVolts){
  document.getElementById("uvIndexColor").innerHTML = "&nbsp;";
  document.getElementById("uvIndexMsg").style.textAlign = "left";
  if (miliVolts < 50) {
    document.getElementById("uvIndex").innerHTML = "0";
    document.getElementById("uvIndexColor").style.backgroundColor='#FFFFFF';
    document.getElementById("uvIndexMsg").innerHTML = "<small>Exposure level - NONE</small>";
  }
  if (miliVolts > 50 && miliVolts < 227){
    document.getElementById("uvIndex").innerHTML = "1";
    document.getElementById("uvIndexColor").style.backgroundColor = '#00FF00';
    document.getElementById("uvIndexMsg").innerHTML = "<small>Exposure level - LOW</small>";
  }
  if (miliVolts > 227 && miliVolts < 318) {
    document.getElementById("uvIndex").innerHTML = "2";
    document.getElementById("uvIndexColor").style.backgroundColor='#00FF00';
  }
  if (miliVolts > 318 && miliVolts < 408) {
    document.getElementById("uvIndex").innerHTML = "3";
    document.getElementById("uvIndexColor").style.backgroundColor='#FFFF00';
    document.getElementById("uvIndexMsg").innerHTML = "<small>Exposure level - MODERATE</small>";
  }
  if (miliVolts > 408 && miliVolts < 503) {
    document.getElementById("uvIndex").innerHTML = "4";
    document.getElementById("uvIndexColor").style.backgroundColor='#FFFF00';
  }
  if (miliVolts > 503 && miliVolts < 606) {
    document.getElementById("uvIndex").innerHTML = "5";
    document.getElementById("uvIndexColor").style.backgroundColor='#FFFF00';
  }
  if (miliVolts > 606 && miliVolts < 696) {
    document.getElementById("uvIndex").innerHTML = "6";
    document.getElementById("uvIndexColor").style.backgroundColor='#FF4F00';
    document.getElementById("uvIndexMsg").innerHTML = "<small>Exposure level - HIGH (Get out from the sunlight! get out now!)</small>";
  }
  if (miliVolts > 696 && miliVolts < 795) {
    document.getElementById("uvIndex").innerHTML = "7";
    document.getElementById("uvIndexColor").style.backgroundColor='#FF4F00';
  }
  if (miliVolts > 795 && miliVolts < 881) {
    document.getElementById("uvIndex").innerHTML = "8";
    document.getElementById("uvIndexColor").style.backgroundColor='#FF0000';
    document.getElementById("uvIndexMsg").innerHTML = "<small>Exposure level - VERY HIGH (Get out from the sunlight! get out now!)</small>";
  }
  if (miliVolts > 881 && miliVolts < 976) {
    document.getElementById("uvIndex").innerHTML = "9";
    document.getElementById("uvIndexColor").style.backgroundColor='#FF0000';
    document.getElementById("uvIndexMsg").innerHTML = "<small>Exposure level - VERY HIGH (If you value your health, don't go outside, just stay at home!)</small>";
  }
  if (miliVolts > 976 && miliVolts < 1079) {
    document.getElementById("uvIndex").innerHTML = "10";
    document.getElementById("uvIndexColor").style.backgroundColor='#FF0000';
  }
  if (miliVolts > 1079 && miliVolts < 1170) {
    document.getElementById("uvIndex").innerHTML = "11";
    document.getElementById("uvIndexColor").style.backgroundColor='#FF0000';
    document.getElementById("uvIndexMsg").innerHTML = "<small>Exposure level - Extreme (If you value your health, don't go outside, just stay at home!)</small>";
  }
  if (miliVolts > 1170) {
    document.getElementById("uvIndex").innerHTML = "11+";
    document.getElementById("uvIndexColor").style.backgroundColor='#B400FF';
    document.getElementById("uvIndexMsg").innerHTML = "<small>Exposure level - Extreme (Intensity of sunlight is really at maximum, just stay at home!)</small>";
  }
}

$(window).on("load", function() {
  $('.indoor').slideDown();
  $('.outdoor').slideDown();
});

$(document).ready(function(){
    $("#togOutBtn").click(function(){
        $(".outdoor").toggle(1000, function(){
           showHideFunc('togOutBtn', 'Out');
        });
    });

    $("#togIndorBtn").click(function(){
        $(".indoor").toggle(1000, function(){
           showHideFunc('togIndorBtn', 'In');
		});
	});
});

function showHideFunc(elementClass, inOut)
{
  $("." + elementClass).text(function(){ 
                return ($(this).next('fieldset').is(':visible') ) 
                ? 'Hide ' + inOut + 'doors' : 'Show ' + inOut + 'doors' 
			});
}

function waterPlant1() {
	var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", "http://"+ hostName.replace("192.168.1.3", "192.168.1.156") + ":8095/?waterPlant1");
    ifrm.setAttribute("id", "iframe");
    ifrm.style.visibility = "false";
    ifrm.style.display = "none";
    document.body.appendChild(ifrm);

 }
