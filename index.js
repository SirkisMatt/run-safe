'use strict';

//map and infoWindow set to global scope
let map 
let infoWindow = null

function initMap() {
    //initialize map on specific destination
    let myLatlng = {lat: -41.269, lng: 173.285};
    //set map to user location if their geolocation is on 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            let pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }; 
            map = new google.maps.Map(
                document.getElementById('map'), {
                    zoom: 7, 
                    center: pos
                }); 
        });     
    } else {
        map = new google.maps.Map(
            document.getElementById('map'), {
                zoom: 4, 
                center: myLatlng
            });
    }
    
};

//forecast set to global scope
let forecast
let city

function displayResults(responseJson){
console.log(responseJson);
    //get coords, and separate lat and lon to pass into postInfo()
    let coords = responseJson.data.city.geo
    console.log(coords)
    let aqi = responseJson.data.aqi
    //grab lat and lon numbers from coords array
    let latitude = parseFloat(coords[0]);
    let longitude = parseFloat(coords[1]);
    console.log(responseJson.data.city.url);

    //get forecast / city and declare it so you can use it in pm25Forecast()
    forecast = responseJson.data.forecast.daily.pm25
    city = responseJson.data.city.name
    
    //set contentString to scope outside of if else to pass into postInfo()
    let contentString

    //if else to add class="color" depending on aqi
    //onClick="pm25Forecast()" to add forecast under map
    if (aqi <= 50) {
    contentString = `<div id="content" ><h3 id="firstHeading" class="green">AQI ${aqi}
        </h3><p><span class="underline">Location:</span> ${city}</p><p>Good Quality!</p><p>Updated: ${responseJson.data.time.s}
        </p><a href="${responseJson.data.city.url}" target="blank" class="link">More Info</a>
        </div>`;
    } else if (aqi >= 51 && aqi <= 100) {
    contentString = `<div id="content"><h3 id="firstHeading" class="yellow">AQI ${aqi}
        </h3><p><span class="underline">Location:</span> ${city}</p><p>Moderate</p><p>Updated ${responseJson.data.time.s}
        </p><a href="${responseJson.data.city.url}" target="blank" class="link">More Info</a>
        </div>`;
    } else if (aqi >= 101 && aqi <= 150) {
        contentString = `<div id="content"><h3 id="firstHeading" class="orange">AQI ${aqi}
        </h3><p><span class="underline">Location:</span> ${city}<p>Unhealthy for Sensitive Groups</p><p>Updated ${responseJson.data.time.s}
        </p><a href="${responseJson.data.city.url}" target="blank" class="link">More Info</a>
        </div>`;
    } else if (aqi >= 151 && aqi <= 200) {
        contentString = `<div id="content" ><h3 id="firstHeading" class="red">AQI ${aqi}
        </h3><p><span class="underline">Location:</span> ${city}</p><p>Unhealthy</p><p>Updated ${responseJson.data.time.s}
        </p><a href="${responseJson.data.city.url}" target="blank" class="link">More Info</a>
        </div>`;
    } else if (aqi >= 201 && aqi < 300) {
        contentString = `<div id="content" ><h3 id="firstHeading" class="purple">AQI ${aqi}
        </h3><p><span class="underline">Location:</span> ${city}</p><p>Very Unhealthy</p><p>Updated ${responseJson.data.time.s}
        </p><a href="${responseJson.data.city.url}" target="blank" class="link">More Info</a>
        </div>`;
    } else {
        contentString = `<div id="content"><h3 id="firstHeading" class="really-red">AQI ${aqi}
        </h3><p><span class="underline">Location:</span> ${city}</p><p>Hazardous</p><p>Updated ${responseJson.data.time.s}
        </p><a href="${responseJson.data.city.url}" target="blank" class="link">More Info</a>
        </div>`;
    }
    //Create infoWindow and place on map in City's coords
    postInfo(latitude, longitude, map, contentString);
};

//function to add forecast if user clicks for forecast in infoWindow
function pm25Forecast(){
    //empty more-info if there is anything
    $('#more-info').empty();
    $("#forecast-header").empty();
    $('.show').show();
   
let table = $("<table></table>");
let thead = $("<thead></thead>");
thead.append($("<th></th>").html("Date"));
thead.append($("<th></th>").html("Average pm25"));
thead.append($("<th></th>").html("Max pm25"));
thead.append($("<th></th>").html("Min pm25"));
let tbody = $("<tbody></tbody>");
    //iterate through forecast array and append to table body
    for (let i = 2; i < forecast.length; i++) {
    let row = $("<tr></tr>");
  
    row.append($("<td></td>").html(forecast[i].day));
    row.append($("<td></td>").html(forecast[i].avg));
    row.append($("<td></td>").html(forecast[i].max));
    row.append($("<td></td>").html(forecast[i].min));

    tbody.append(row);
    }
        //add tbody to thead
        table.append(thead).append(tbody);
        //add table to the DOM
        $("#more-info").append(table);    
        console.log(city)
        $("#forecast-header").prepend(`${city}`);

};

//Adds infoWindow in Map
function postInfo(latitude, longitude, map, contentString) {
    
    //Get rid of last infoWindow
    if (infoWindow){
       infoWindow.close();
    };
  
    // Create a new InfoWindow
    infoWindow = new google.maps.InfoWindow({
        position: { lat: latitude, lng: longitude },
        map: map,
        maxWidth: 200
    
    });
    infoWindow.setContent(contentString);
    infoWindow.open(map);
    pm25Forecast();
};

//api key for AQI API 
var aqiKey = 'cd6787d500a356713b424fe3ac549f5e6a1179e6';

//Get Air quality by City
function getAir(searchTerm){
 
    fetch(`https://api.waqi.info/feed/${searchTerm}/?token=` + aqiKey)
    .then(response => {
        if (response.ok) {
        $('#js-error-message').empty();
        return response.json();
        }
        throw new Error(response.statusText);
    })
    //Pass json results to displayResults function
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
        Swal.fire(`Sorry, we don't have a reading of that city`);
    }); 
};

// Hide all elements with class="containerTab", except for the one that matches the clickable grid column
function openTab(tabName) {
    let i, x;
    x = document.getElementsByClassName("containerTab");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    $('hidden').remove();
    document.getElementById(tabName).style.display = "block";
    let element = document.getElementById(tabName)
    element.scrollIntoView({ behavior: 'smooth', block: 'end'});
  }


let searchTerm
//listen for search and pass searchTerm into getAir()
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        searchTerm = $('#city').val();
        getAir(searchTerm);
});
};

$(watchForm);