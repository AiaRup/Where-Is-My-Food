class EventsHandler {
  constructor(restaurantRepositories, restaurantRenders, googleMaps) {
    this.restaurantRepositories = restaurantRepositories;
    this.restaurantRenders = restaurantRenders;
    this.googleMaps = googleMaps;
  }

  getRestaurandData() {
    $(document).ready (()=> {
    // get menu from DB and Restaurant Name
      this.restaurantRepositories.getRestaurantNameAndMenu().then(() => {
        $('.restaurant-name').text(this.restaurantRepositories.restaurant.name);
        // get menu from result array
        let dishOption;

        this.restaurantRepositories.restaurant.menu.forEach((dish) => {
          dishOption += `<option value="${dish.name}" data-price="${dish.price}">${dish.name} - ${dish.price}$</option>`;
        });
        $('#dishOptions').append(dishOption);
      });
    });
  }

  fillNewForm() {
    $('.btnNewOrder').click((event) => {
      event.stopPropagation();
      $('.order-form').toggle();

    });
  }

  addNewDish() {
    let totalPrice = 0;
    $('.choose-dish').click((event) => {
      //get the dish that was chosen
      $('#dishOptions option').each(function() {
        if($(this).is(':selected')) {
          // if nothing was selected (first option)
          if (($(this)).val() == 0) {
            $('.msg-select-dish').text('Please select a dish').show().fadeOut(5000);
          } else {
            let dish = $(this).val();
            let quantity = $('.quantity').val();
            let cost = 0;
            let price = $(this).data('price');
            // if amount was 0 or undefind put 1 as default
            if (quantity == 0 || quantity == '') {
              quantity = 1;
            }
            // calculate dish cost and total price
            cost = quantity * price;
            totalPrice = cost + totalPrice;

            $('.dish-list').append(`<li data-cost="${cost}" data-dish="${dish}" data-amount="${quantity}"><input type=button class="dltBtn" value="X"><p> ${quantity} X ${dish}, Price - ${cost}$</p></li>`);
            $('.total-price').remove();
            $('.order-list').append(`<p class="total-price" data-total="${totalPrice}">Total Price: ${totalPrice}$</p>`);
          }
        }
      });
    });
  }

  deleteBtn() {
    $('.dish-list').on('click', '.dltBtn', (e) => {
      let dishCost = $(e.currentTarget).closest('li').data('cost');

      let currentTotal = $(e.currentTarget).closest('.dish-list').siblings('.total-price').data('total');
      let newTotal = currentTotal - dishCost;

      $('.order-list').find('.total-price').remove();
      $('.order-list').append(`<p class="total-price" data-total="${newTotal}">Total Price: ${newTotal}$</p>`);

      $(e.currentTarget).closest('li').remove();
    });
  }

  submitNewOrder() {
    $('.submitOrder').click((event) => {
      event.stopPropagation();
      event.preventDefault();

      // get total orders from DB
      this.restaurantRepositories.getRestaurantNumOrders().then(()=> {
        let idOrder = (this.restaurantRepositories.restaurant.numOrders) + 1;

        // get information from the page form

        // get all order's dishes //TODO:
        let dishSelection = [];
        $('.dish-list li').each(function() {
          let dishSelected = {
            name: $(this).data('dish'),
            price:  $(this).data('cost'),
            amount: $(this).data('amount')
          };
          dishSelection.push(dishSelected);
        });
        console.log('dish array', dishSelection);


        // get order time as string
        let timeInMs = new Date(Date.now());
        let orderTime = timeInMs.toLocaleTimeString().substring(0, 5) + ' on ' + timeInMs.toLocaleDateString().replace(/\./g, '/');

        // create new order object
        let newOrder = {
          name: $('#name').val(),
          phoneNumber: $('#phone').val(),
          paymentMethod: $('#paymentSelection').val(),
          dishes: dishSelection,
          totalPrice: $('.total-price').data('total'),
          status: 'received',
          isTaken: false,
          time: orderTime,
          orderId: idOrder
        };

        // get location data from google api
        let location = $('#address').val();
        this.googleMaps.getCoords(location).then((response) => {
          console.log('location response', response);
          // update new order location
          newOrder.location = {

            // Geomatry
            latitude: response.results[0].geometry.location.lat,
            longitude: response.results[0].geometry.location.lng,
            // Formatted Address
            address: response.results[0].formatted_address
          };
          console.log('order sent to server', newOrder);

          // send new order to DB
          this.restaurantRepositories.addNewOrder(newOrder).then(() => {
          // get orderId and display on page
            $('.orderId').text(newOrder.orderId);
            $('.modal').show();
          });
          // update restaurant number of orders on the server
          this.restaurantRepositories.updateRestaurantNumOrders(idOrder);
        });
      });
    });
  }

  closePopUp() {
    $('.closeBtn').click(() => {
      $('.modal').hide();
    });
  }

}


export default EventsHandler;