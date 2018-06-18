
class GoogleMap {
  constructor() {}

  getCoords (location) {
    let apiKey = 'AIzaSyBiWunZ9dpyU3leuY_TMU_t81A53irRnTM';
    $.ajax({
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`
    })
      .then(function(response) {
        // Log full response
        console.log(response);
        // Formatted Address
        let formattedAddress = response.results[0].formatted_address;
        // Geomatry
        let lat = response.results[0].geometry.location.lat;
        let lng = response.results[0].geometry.location.lng;
      }).catch(function(error) {
        console.log(error);
      });
  }

  initMap(restaurantLatLong) {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    // var restaurantLocation = new google.maps.LatLng(41.850033, -87.6500523);
    var restaurantLocation = new google.maps.LatLng(restaurantLatLong.latitude, restaurantLatLong.longitude);
    var mapOptions = {
      zoom:7,
      center: restaurantLocation
    };
    var map = new google.maps.Map(document.getElementById('directions-canvas'), mapOptions);
    directionsDisplay.setMap(map);
  }

  calcRoute() {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    var request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    };
    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(result);
      }
    });
  }


}

export default GoogleMap;





