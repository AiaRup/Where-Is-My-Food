class EventsHandler {
  constructor(restaurantRepositories, restaurantRenders, googleMaps) {
    this.restaurantRepositories = restaurantRepositories;
    this.restaurantRenders = restaurantRenders;
    this.googleMaps = googleMaps;
    this.counter = 0;
  }

  fillNewForm() {
    $(".btnNewOrder").click((event) => {
      event.stopPropagation();
      $('.order-form').toggle();
    })
  };

  addNewDish() {
    let totalPrice = 0;
    $('.choose-dish').click(() => {
      let dish = $('#dishOptions').val();
      let quantity = $('.quantity').val();
      let cost = 0;
      let price = 20; //dammy price to check
      
      if(quantity == 0 || quantity == ""){
        quantity = 1;
      }

      cost = quantity * price;
      totalPrice = cost + totalPrice;

      $('.dish-list').append(`<li data-cost="${cost}"><input type=button id="dltBtn" value="X">`
      + `<p>` + ` ` + quantity + `X ` + dish + `, Price - ` + cost + `$` + `</p></li>`)
      $('.total-price').empty()
      $('.total-price').attr('data-total', totalPrice)
      $('.total-price').text(`Total Price: ` + totalPrice);
    });
  };

  deleteBtn() {
    $('.dish-list').on('click','#dltBtn', (e) => {
      let dishCost = $(e.currentTarget).parent("li").data("cost");
      let totalCost =  $(e.currentTarget).closest(".dish-list").siblings(".total-price").data("total");
      $(.)
      totalCost = totalCost - dishCost;

      $('.total-price').text(`Total Price: ` + totalCost)
    
      $(e.currentTarget).parent().remove();
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


    this.googleMaps.getCoords(location).then((response)=>{
      console.log(response)
      newOrder.location = {
      // Formatted Address
      address: response.results[0].formatted_address,
      // Geomatry
      latitude: response.results[0].geometry.location.lat,
      longitude: response.results[0].geometry.location.lng
      }
      console.log(newOrder)
      })
      
      //Get AJAX response from server of new order
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