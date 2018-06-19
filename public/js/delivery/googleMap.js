class GoogleMap {
  constructor() {}

  getCoords(location) {
    let apiKey = 'AIzaSyBiWunZ9dpyU3leuY_TMU_t81A53irRnTM';
    $.ajax({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`
      })
      .then(function (response) {
        // Log full response
        console.log(response);
        // Formatted Address
        let formattedAddress = response.results[0].formatted_address;
        // Geomatry
        let lat = response.results[0].geometry.location.lat;
        let lng = response.results[0].geometry.location.lng;
      }).catch(function (error) {
        console.log(error);
      });
  }

  initMap(restaurantLocation, destination, waypoints) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: restaurantLocation
    });
    directionsDisplay.setMap(map);

    // calaulate route
    this.calculateAndDisplayRoute(directionsService, directionsDisplay, restaurantLocation, destination, waypoints);
    // this.calculateAndDisplayRoute(directionsService, directionsDisplay, restaurantLocation, destination);
  }

  // calculateAndDisplayRoute(directionsService, directionsDisplay, start, destination) {
  calculateAndDisplayRoute(directionsService, directionsDisplay, start, destination, waypoints) {
    var waypts = [];

    for (var i = 0; i < waypoints.length; i++) {
      waypts.push({
        location: waypoints[i],
        stopover: true
      });
    }
    console.log('start', start);
    console.log('des', destination);
    console.log('way', waypts);


    directionsService.route({
      origin: start,
      destination: destination,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
    }, function (response, status) {
      if (status === 'OK') {
        console.log(response);

        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        // For each route, display summary information.
        for (let i = 0; i < route.legs.length; i++) {
          let routeSegment = i + 1;
          summaryPanel.innerHTML += `<div id="route-${routeSegment}">`;
          summaryPanel.innerHTML += `<b>Route Segment: ${routeSegment}</b><br>`;
          summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br>';
          summaryPanel.innerHTML += route.legs[i].duration.text + '<br><br>';
          for (let j = 0; j < route.legs[i].steps.length; j++) {
            if (route.legs[i].steps[j].maneuver) {
              summaryPanel.innerHTML += `<img src="../img/maneuvers/${route.legs[i].steps[j].maneuver}.png">`;
            }
            summaryPanel.innerHTML += route.legs[i].steps[j].instructions + '<br>';
          }
          summaryPanel.innerHTML += '</div>';
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
}

export default GoogleMap;