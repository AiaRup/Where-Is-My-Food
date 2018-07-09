class CustomerRepository {
  constructor() {
    this.userOrder = {};
    this.status = false;
  }

  getOrderDetailes(orderId) {
    return $.ajax({
      method: 'Get',
      url: `/customer/${orderId}`,
      success: (result) => {
        if (result !== 'Order Not Found') {
          this.userOrder = result;
          this.status = true;
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  // getRestaurantCoords() {
  //   return $.ajax({
  //     method: 'Get',
  //     url: 'restaurant/restauranNameMenu',
  //     success: (restaurantDetails) => {
  //       console.log(restaurantDetails);
  //       // get restaurant coords
  //       this.restaurantCoords.lat = restaurantDetails[0].address.latitude;
  //       this.restaurantCoords.lng = restaurantDetails[0].address.longitude;
  //     },
  //     error: function(jqXHR, textStatus, errorThrown) {
  //       console.log(textStatus);
  //     }
  //   });
  // }

}

export default CustomerRepository;