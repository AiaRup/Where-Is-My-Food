class EventsHandler {
  constructor(restaurantRepositories, restaurantRenders) {
    this.restaurantRepositories = restaurantRepositories;
    this.restaurantRenders = restaurantRenders;
    this.counter = 0;
  }

  fillNewForm() {
    $(".btnNewOrder").click((event) => {
      event.stopPropagation();
      $('.order-form').toggle();
    })
  }

  submitNewOrder() {
    $(".submitOrder").click((event) => {
      event.stopPropagation();
      event.preventDefault();
      let name = $('#name').val();
      let location = $('#address').val();
      let phoneNumber = $('#phoneNumber').val();
      let paymentMethod = $('#paymentSelection').val();
      let dishSelection = $('#dishOptions').find(':selected').val();

      //order object
      let newOrder = {
        name: name,
        location: location,
        phoneNumber: phoneNumber,
        paymentMethod: paymentMethod,
        // dishes: dishes,
        // totalPrice: totalPrice,
        status: "received",
        // orderId: orderId,
        isTaken: false,
        orderId: this.counter++
      }

      this.restaurantRepositories.addNewOrder(newOrder).then(() => {
      })

      $('.modal').show();
    })
  }

  closePopUp() {
    $('.closeBtn').click(() => {
      $('.modal').hide();
    })
  }

}


export default EventsHandler;