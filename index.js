'use strict';

let map 
let infoWindow = null

function initMap() {
    //initialize map on specific destination
    let myLatlng = {lat: -41.269, lng: 173.285};
    map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: myLatlng});
}
 

function displayResults(responseJson){
console.log(responseJson);
    //console.log(responseJson.data.city.geo);
    let coords = responseJson.data.city.geo
    console.log(coords)
    let aqi = responseJson.data.aqi
    //grab lat and lon numbers from coords array
    let latitude = parseFloat(coords[0]);
    let longitude = parseFloat(coords[1]);
    let forecast = responseJson.data.forecast.daily.pm25
    console.log(forecast)
    let contentString
    if (aqi <= 50) {
    contentString = `<div id="content" class="green"><h3 id="firstHeading">${responseJson.data.city.name}
    </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Good Quality!</p><p>Updated ${responseJson.data.time.s}
    </p><button id='infoButton' onClick="${myFunction(forecast)}">Click for more info</button>
    </div></div>`;
    } else if (aqi >= 51 && aqi <= 100) {
    contentString = `<div id="content" class="yellow"><h3 id="firstHeading">${responseJson.data.city.name}
    </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Moderate</p><p>Updated ${responseJson.data.time.s}
    </p><button id='infoButton' onClick="myFunction()">Click for more info</button>
    </div></div>`;
    } else if (aqi >= 101 && aqi <= 150) {
        contentString = `<div id="content" class="orange"><h3 id="firstHeading">${responseJson.data.city.name}
        </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Unhealthy for Sensitive Groups</p><p>Updated ${responseJson.data.time.s}
        </p><button id='infoButton' onClick="myFunction()">Click for more info</button>
        </div></div>`;
    } else if (aqi >= 151 && aqi <= 200) {
        contentString = `<div id="content" class="red"><h3 id="firstHeading">${responseJson.data.city.name}
        </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Unhealthy</p><p>Updated ${responseJson.data.time.s}
        </p><button id='infoButton' onClick="myFunction()">Click for more info</button>
        </div></div>`;
    } else if (aqi >= 201 && aqi < 300) {
        contentString = `<div id="content" class="purple"><h3 id="firstHeading">${responseJson.data.city.name}
        </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Very Unhealthy</p><p>Updated ${responseJson.data.time.s}
        </p><button id='infoButton' onClick="myFunction()">Click for more info</button>
        </div></div>`;
    } else {
        contentString = `<div id="content" class="really-red"><h3 id="firstHeading">${responseJson.data.city.name}
        </h3><div id="bodyContent"><p>AQI ${aqi}</p><p>Hazardous</p><p>Updated ${responseJson.data.time.s}
        </p><button id='infoButton' onClick="myFunction()">Click for more info</button>
        </div></div>`;
    }
    
    postInfo(latitude, longitude, map, contentString);

}
function myFunction(forecast){
    
    console.log(forecast)
}

//Info window function
function postInfo(latitude, longitude, map, contentString) {
    
    if (infoWindow){
       infoWindow.close();
    };
    console.log("Lat", latitude);
   console.log("Lng", longitude);
  
    // Create a new InfoWindow.
   
    infoWindow = new google.maps.InfoWindow({
        position: { lat: latitude, lng: longitude },
        map: map,
        maxWidth: 200
    
    });
    infoWindow.setContent(contentString);
    infoWindow.open(map);
  
    
}
/*$( "#infoButton" ).click(function() {
    console.log('clicked');
  });    */


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
//getAir()

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        let searchTerm = $('#city').val();
        console.log(searchTerm);
        getAir(searchTerm);
});
}

$(watchForm);