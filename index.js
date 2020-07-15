'use strict';
//map and infoWindow set to global scope
let map 
let infoWindow = null

function initMap() {
    //initialize map on specific destination
    let myLatlng = {lat: -41.269, lng: 173.285};
    map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: myLatlng});
}

//responseJson and forecast set to global scope
let responseJson
let forecast

function displayResults(responseJson){
console.log(responseJson);
    //get coords, and separate lat and lon to pass into postInfo()
    let coords = responseJson.data.city.geo
    console.log(coords)
    let aqi = responseJson.data.aqi
    //grab lat and lon numbers from coords array
    let latitude = parseFloat(coords[0]);
    let longitude = parseFloat(coords[1]);

    //get forecast and declare it so you can use it in pm25Forecast()
    forecast = responseJson.data.forecast.daily.pm25
    
    //set contentString to scope outside of if else to pass into postInfo()
    let contentString

    //if else to add class="color" depending on aqi
    //onClick="pm25Forecast()" to add forecast under map
    if (aqi <= 50) {
    contentString = `<div id="content" class="green"><h3 id="firstHeading">${responseJson.data.city.name}
    </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Good Quality!</p><p>Should be good for a run!</p><p>Updated ${responseJson.data.time.s}
    </p><button id='infoButton' onClick="pm25Forecast()">Click for forecast</button>
    </div></div>`;
    } else if (aqi >= 51 && aqi <= 100) {
    contentString = `<div id="content" class="yellow"><h3 id="firstHeading">${responseJson.data.city.name}
    </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Moderate</p><p>Updated ${responseJson.data.time.s}
    </p><button id='infoButton' onClick="pm25Forecast()">Click for forecast</button>
    </div></div>`;
   
    } else if (aqi >= 101 && aqi <= 150) {
        contentString = `<div id="content" class="orange"><h3 id="firstHeading">${responseJson.data.city.name}
        </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Unhealthy for Sensitive Groups</p><p>Updated ${responseJson.data.time.s}
        </p><button id='infoButton' onClick="pm25Forecast()">Click for forecast</button>
        </div></div>`;
    } else if (aqi >= 151 && aqi <= 200) {
        contentString = `<div id="content" class="red"><h3 id="firstHeading">${responseJson.data.city.name}
        </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Unhealthy</p><p>Updated ${responseJson.data.time.s}
        </p><button id='infoButton' onClick="pm25Forecast()">Click for forecast</button>
        </div></div>`;
    } else if (aqi >= 201 && aqi < 300) {
        contentString = `<div id="content" class="purple"><h3 id="firstHeading">${responseJson.data.city.name}
        </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Very Unhealthy</p><p>Updated ${responseJson.data.time.s}
        </p><button id='infoButton' onClick="pm25Forecast()">Click for forecast</button>
        </div></div>`;
    } else {
        contentString = `<div id="content" class="really-red"><h3 id="firstHeading">${responseJson.data.city.name}
        </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Hazardous</p><p>Updated ${responseJson.data.time.s}
        </p><button id='infoButton' onClick="pm25Forecast()">Click for forecast</button>
        </div></div>`;
    }
    //Create infoWindow and place on map in City's coords
    postInfo(latitude, longitude, map, contentString);
}

//function to add forecast if user clicks for forecast in infoWindow
function pm25Forecast(){
  
    console.log(forecast)
    //empty more-info if there is anything
    $('#more-info').empty();
    //add unique id to each date
    let id = 0
    
    //iterate through forecast array and 
       let mapped =  forecast.map(product => {  
        return `
      <div id="${id++}"><p>Date: ${ product.day }<p>
      <p>pm25 Average: ${ product.avg }<p>
      <p>pm25 Max: ${ product.max }<p>
      <p>pm25 Min: ${ product.min }<p></div> <br>`;
  }).join('');
        console.log(mapped);
    
    //Display mapped results in the DOM
    $('#more-info').append(`<h3>${searchTerm} pm25 Forecast</h3><br>` + mapped);
}

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
}

//Get Air quality by City
function getAir(searchTerm){
 
    fetch(`https://api.waqi.info/feed/${searchTerm}/?token=`)
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
        $('#js-error-message').text(`Sorry we don't have a reading of that City!`);
    }); 
}
let searchTerm
//listen for search and pass searchTerm into getAir()
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        searchTerm = $('#city').val();
        console.log(searchTerm);
        getAir(searchTerm);
});
}

$(watchForm);