class GoogleMap {
  constructor() {
    this.routeOrders = [];
  }

  getCoords(location) {
    let apiKey = 'AIzaSyBiWunZ9dpyU3leuY_TMU_t81A53irRnTM';
    return $.ajax({
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&language=en&key=${apiKey}`,
      success: (response) => {
        // Log full response
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  initMap(restaurantLocation) {
  // initMap(restaurantLocation, destination, waypoints) {
    // var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: restaurantLocation
    });
    directionsDisplay.setMap(map);

    return directionsDisplay;


    // calaulate route
    // this.calculateAndDisplayRoute(directionsService, directionsDisplay, restaurantLocation, destination, waypoints);
  }

  calculateAndDisplayRoute(directionsDisplay, start, destination, waypoints, optimize = true) {
    var directionsService = new google.maps.DirectionsService;

    // new promise
    let deferred = $.Deferred(); // promise

    let waypts = [];
    // initizialize order route array
    this.routeOrder = [];

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
      optimizeWaypoints: optimize,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        console.log(response);

        directionsDisplay.setDirections(response);
        let route = response.routes[0];
        let summaryPanel = $('#directions-panel');
        var durationTime = 0;

        for (var i = 0; i < route.legs.length; i++) {
          // get duration time as number from the string
          let durNum = Number(route.legs[i].duration.text
            .substr(0, route.legs[i].duration.text.indexOf(' ')));
          durationTime += durNum;
          // push the address and duration to local array
          if (!i) {
            this.routeOrders.push({
              address: route.legs[i].start_address,
              duration: 0
            });
          }
          this.routeOrders.push({
            address: route.legs[i].end_address,
            duration: durationTime
          });

          let routeSegment = i + 1;
          let routeDiv = $(`<div data-route="${route.legs[i].end_address}"></div>`);

          routeDiv.append('<b>Route Segment: ' + routeSegment + '</b><br>');
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
        // resolve
        console.log('google route array from googleMap module', this.routeOrders);
        deferred.resolve(this.routeOrders);

      } else {
        window.alert('Directions request failed due to ' + status);
        // reject
        deferred.reject(status);
      }
    });
    return deferred.promise();
  }
}

export default GoogleMap;