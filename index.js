'use strict';

function initMap() {
    //initialize map on specific destination
    let myLatlng = {lat: -41.269, lng: 173.285};
    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: myLatlng});

    // Create the initial InfoWindow.
  let infoWindow = new google.maps.InfoWindow(
      {content: 'Click the map to see if it is safe to exercise outside!', position: myLatlng});
  infoWindow.open(map);
  // Configure the click listener.
    map.addListener('click', function(mapsMouseEvent) {
    // Close the current InfoWindow.
    infoWindow.close();
   
    let coords = mapsMouseEvent.latLng.toString().split(",");
    console.log(coords);
    //grab lat and lon numbers from coords array
    let lat = parseFloat(coords[0].substring(1));
    let lon = parseFloat(coords[1]);
    console.log("Lat", lat);
    console.log("Lng", lon);
    //call airByLatLon with lat, lon arguments
    airByLatLon(lat, lon);
    
    let contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    `<h1 id="firstHeading" class="firstHeading">Location</h1>` +
    '<div id="bodyContent">' +
    "<p>AQI</p>" + "<p>Updated</p>" + "<button id='infoButton'>Click for more info</button>"
    "</div>" +
    "</div>";
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({position: mapsMouseEvent.latLng});
    infoWindow.setContent(contentString);
    infoWindow.open(map);

  });
/*function window(){
}*/
}



    //get lat,lng from click event and pass it into url
function airByLatLon(lat, lon){
        fetch (`https://api.waqi.info/feed/geo:${lat};${lon}/?token=`)
        .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.statusText);
          })
          //Pass json results to displayResults function
          .then(responseJson => displayResults(responseJson))
          .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
          }); 
}



function displayResults(responseJson){
    console.log(responseJson);
   console.log(responseJson.data.city.name)
}

        


//Get Air quality by City
function getAir(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
          
    fetch("https://api.waqi.info/feed/Nelson/?token=", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
//getAir()