'use strict';



function initMap() {
    //initialize map on specific destination
    let myLatlng = {lat: -41.269, lng: 173.285};
    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: myLatlng});

    // Create the initial InfoWindow.
  let infoWindow = new google.maps.InfoWindow({
      content: 'Click the map to see if it is safe to exercise outside!', 
      position: myLatlng
    });
    infoWindow.open(map);
    /*
    // Configure the click listener.
    map.addListener('click', function(mapsMouseEvent) {
    // Close the current InfoWindow.
    infoWindow.close();
   
    //get coords and create an array
    let coords = mapsMouseEvent.latLng.toString().split(",");
    console.log(coords);
    //grab lat and lon numbers from coords array
    let lat = parseFloat(coords[0].substring(1));
    let lon = parseFloat(coords[1]);
    console.log("Lat", lat);
    console.log("Lng", lon);
    //call airByLatLon with lat, lon arguments
    airByLatLon(lat, lon);
  });

  //add listener to add an info window
  map.addListener("click", function(e) {
    postInfo(e.latLng, map);
  });*/
}



//get lat,lng from click event and pass it into url
/*function airByLatLon(lat, lon){
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


*/
function displayResults(responseJson){
    console.log(responseJson);
   console.log(responseJson.data.city.name);
   console.log(responseJson.data.aqi);
   console.log(responseJson.data.time.s);
   //console.log(responseJson.data.city.geo);
   let coords = responseJson.data.city.geo
   console.log(coords)
   //grab lat and lon numbers from coords array
   let latitude = parseFloat(coords[0]);
   let longitude = parseFloat(coords[1]);
   
    postInfo(latitude, longitude, map);
  
   /*
   
   // if there are previous results, remove them
    $('#content').empty();

    $('#content').append(`<div id="content"><div id="siteNotice"></div><h1 id="firstHeading">${responseJson.data.city.name}
    </h1><div id="bodyContent"><p>AQI ${responseJson.data.aqi}</p><p>Updated ${responseJson.data.time.s}
    </p><button id='infoButton'>Click for more info</button>
    </div></div>`);*/
  

}

//Info window function
function postInfo(latitude, longitude, map) {
    
    console.log("Lat", latitude);
   console.log("Lng", longitude);
    //let myLatLng = new google.maps.LatLng(-41.27822953, 173.27352648);
    //console.log(myLatLng);
    
    let contentString = '<div id="content">Oi</div>'
    // Create a new InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        position: { lat: -34.397, lng: 150.644 },
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