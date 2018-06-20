class GoogleMap {
  constructor() {}

  getCoords(location) {
    let apiKey = 'AIzaSyBiWunZ9dpyU3leuY_TMU_t81A53irRnTM';
    return $.ajax({
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`,

      success: (response) => {
        // Log full response
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
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

  }

  // calculateAndDisplayRoute(directionsService,
  calculateAndDisplayRoute(directionsService, directionsDisplay, start, destination, waypoints) {
    var waypts = [];

    for (var i = 0; i < waypoints.length; i++) {
      waypts.push({
        location: waypoints[i],
        stopover: true
      });
    }



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
        let route = response.routes[0];
        let summaryPanel = $('#directions-panel');
        // summaryPanel.innerHTML = '';
        // For each route, display summary information.
        for (let i = 0; i < route.legs.length; i++) {
          let routeSegment = i + 1;
          let routeDiv = $('<div></div>');
          // summaryPanel.innerHTML += `<div class="route-${routeSegment}>`;
          // summaryPanel.innerHTML += '<div><b>Route Segment: ' + routeSegment +
          //   '</b><br>';
          // summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          // summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          // summaryPanel.innerHTML += route.legs[i].distance.text + '<br>';
          // summaryPanel.innerHTML += route.legs[i].duration.text + '<br><br>';
          routeDiv.append('<b>Route Segment: ' + routeSegment +            '</b><br>');
          routeDiv.append(route.legs[i].start_address + ' to ');
          routeDiv.append(route.legs[i].end_address + '<br>');
          routeDiv.append(route.legs[i].distance.text + '<br>');
          routeDiv.append(route.legs[i].duration.text + '<br><br>');
          for (let j = 0; j < route.legs[i].steps.length; j++) {
            if (route.legs[i].steps[j].maneuver) {
              routeDiv.append(`<img src="../img/maneuvers/${route.legs[i].steps[j].maneuver}.png">`);
            }
            routeDiv.append(route.legs[i].steps[j].instructions + '<br>');
          }
          routeDiv.addClass(`route-${routeSegment}>`);
          summaryPanel.append(routeDiv);
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
}

export default GoogleMap;