console.log(screen.width);
google.maps.event.addDomListener(window,'load',autoComplete);

var map;
var dataPoints=[];
var key=0;
var Coords=[];
function autoComplete(){
        var input=document.getElementById('location');
        var autocomplete=new google.maps.places.Autocomplete(input);
        console.log(autocomplete);
google.maps.event.addListener(autocomplete,'place_changed',function(){
          var location=$('#location').val();
      console.log(location);
    $('#about').hide();
       getCoordinates(location);

});
    }
  
function getCoordinates(location){
 console.log(location);
  
 var geocoder = new google.maps.Geocoder();
geocoder.geocode({ address: location }, function(results, status) {
if (status == google.maps.GeocoderStatus.OK) {
    console.log(results);
    var lat=results[0].geometry.location.lat();
     var lng=results[0].geometry.location.lng();
    var loc=new Object();
    console.log(Coords);
        console.log(lat+" "+lng);  
          getNeighbours(lat,lng);  
  
           }
   else{
     alert("Sorry there was an error!Please try again");      
          }  
        }); 
        
    }
function getNeighbours(lat,lng){
      $.ajax({
        url: 'http://api.geonames.org/findNearbyPostalCodesJSON?lat='+lat+'&lng='+lng+'&radius=30&maxrows=5&username=setty1993',
        method : 'GET',
        dataType : 'JSON',
        success:function(results){
            console.log(results);
            console.log(results.postalCodes.length);
            for(var i=0;i<results.postalCodes.length;i++){
                var loc=new Object();
                loc.lat=results.postalCodes[i].lat;
                loc.lng=results.postalCodes[i].lng;
                Coords.push(loc);
                console.log(Coords[i]);
            }
            getWeatherData(Coords);
        },
        error:function(error){
        console.log(error);
}
});
    
}
function getWeatherData(data){
    
    if(key == 0){
               $.ajax({
        url: 'https://api.darksky.net/forecast/db1eb1ccae351c015697b3ffc9320736/'+Coords[key].lat+','+Coords[key].lng+"/?exclude=[minutely,alerts,flags,hourly]",
        method : 'GET',
        dataType : 'JSONP',
        jsonp : "callback",
        jsonpCallback:  "storeData",
        error:function(error){ 
        console.log(error);
}
    }); 
    }
      else if(key >0 && key<5){
           
           $.ajax({
        url: 'https://api.darksky.net/forecast/db1eb1ccae351c015697b3ffc9320736/'+Coords[key].lat+','+Coords[key].lng+"/?exclude=[minutely,alerts,flags,hourly,daily]",
        method : 'GET',
        dataType : 'JSONP',
        jsonp : "callback",
        jsonpCallback:  "storeData",
        error:function(error){ 
            console.log("error");
}
    }); 
       }
       
else{
       // console.log(Coords);
     console.log(dataPoints);
      //  console.log(key);
       displayResults(dataPoints[0].currently);
       markPoints();
       dailyBlock();
}

}
function storeData(data){
        if(key ==0){
         var temp={};
        temp.latitude=data['latitude'];
        temp.longitude=data['longitude'];
        temp.currently=data['currently'];
        temp.daily=data['daily'];
        dataPoints.push(temp);
        key++;
        getWeatherData(Coords);
}else if(key >0 && key<5){
        var temp={};
        temp.latitude=data['latitude'];
        temp.longitude=data['longitude'];
        temp.currently=data['currently'];
        dataPoints.push(temp);
        key++;
        getWeatherData(Coords);
}else{
    //console.log();
}
        
}
   function displayResults(data){
      // console.log(data);
       var skycons = new Skycons({"color": "black"});
    $('.current').html('<div class="col-md-7" id="dTemp"><span>Temperature :</span><p>'+data['temperature']+'</p><br><span>Summary:</span><p>'+data['summary']+'</p><br><span>Cloud Cover :</span><p>'+data['cloudCover']+'</p><br><span>DewPoint :</span><p>'+data['dewPoint']+'</p><br><span>Humidity :</span><p>'+data['humidity']+'</p><br><span>Pressure :</span><p>'+data['pressure']+'</p><br><span>Visibility :</span><p>'+data['visibility']+'</p><br><span>WindSpeed :</span><p>'+data['windSpeed']+'</p><br><span>Ozone :</span><p>'+data['ozone']+'</p></div><div class="col-md-5" id="dIcon"><canvas id="icon" width="150" height="150"></canvas></div>');
       $('.closebox').html('');
    skycons.add("icon", data['icon']);  
    skycons.play(); 
       



}
function markPoints(){
var base= "C:\Users\\Sadhana\\Documents\\WeatherApplication\\climacons\\" ;
var mapOptions = {
    center: new google.maps.LatLng(Coords[0].lat,Coords[0].lng),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
 var map = new google.maps.Map(document.getElementById("mapping"), mapOptions);
 for(var i=0;i<Coords.length;i++){
    
     //console.log(Coords[i]);
     //console.log(dataPoints[i].currently.icon);
    
  var marker = new google.maps.Marker({
  position: Coords[i],
  map: map,
 icon : {
     url:base + dataPoints[i].currently.icon + ".svg",
        labelOrigin: new google.maps.Point(10, 25)

  },
      label :{
    text: ''+dataPoints[i].currently.temperature+'',
    color: "black",
    fontSize: "20px",
    //fontWeight: "bold",

  },
 
});

 }
 }    
  
function dailyBlock(){
    $('.dailyBlock ').html('');
    //console.log(dataPoints[0].daily.data);
    var skycons = new Skycons({"color": "black"});
    for(var i=1;i<7;i++){
 var date = new Date(dataPoints[0].daily.data[i].time*1000);
var year = date.getUTCFullYear();
var month = date.getUTCMonth() + 1;
var day = date.getUTCDate();
var dateString = month+ "/" +day+ "/" +year;
        $('.dailyBlock ').append('<div class="col-md-2 dBlocks" id='+i+' onclick="display('+i+')" ><canvas id=canvas'+i+' width="50" height="50"></canvas><h4>'+dateString+'</h4></div></a>');
    skycons.add('canvas'+i+'', dataPoints[0].daily.data[i].icon);  
    skycons.play();
    }
   
}

function display(i){
        var skycons = new Skycons({"color": "black"});

     $('.current').html('<div class="col-md-9" id="dTemp"><span>Minimum Temperature :</span><p>'+dataPoints[0].daily.data[i].temperatureMin+'</p><br><span>Maximum Temperature:</span><p>'+dataPoints[0].daily.data[i].temperatureMax+'</p><br><span>Cloud Cover :</span><p>'+dataPoints[0].daily.data[i].cloudCover+'</p><br><span>Humidity :</span><p>'+dataPoints[0].daily.data[i].humidity+'</p><br><span>Pressure :</span><p>'+dataPoints[0].daily.data[i].pressure+'</p><br><span>WindSpeed :</span><p>'+dataPoints[0].daily.data[i].windSpeed+'</p><br><span>Ozone :</span><p>'+dataPoints[0].daily.data[i].ozone+'</p><br><span>Summary :</span><p>'+dataPoints[0].daily.data[i].summary+'</p></div><canvas id="iconD" width="100" height="100"></canvas>');
    $('.closebox').html('<a href="#close" title="Close" class="close" onclick="displayResults(dataPoints[0].currently)"><</a>');
    skycons.add("iconD", dataPoints[0].daily.data[i].icon);  
    skycons.play();
    $('html, body').animate({
        scrollTop: $("html").offset().top
    }, 1000);

}

$('#location').keyup(function(){
     map= null;
 dataPoints=[];
 key=0;
 Coords=[];
});

