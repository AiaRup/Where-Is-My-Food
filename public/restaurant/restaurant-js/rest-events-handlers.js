class EventsHandler {
  constructor(restRepository, restRenderer, googleMaps) {
    this.restRepository = restRepository;
    this.restRenderer = restRenderer;
    this.googleMaps = googleMaps;
    this.$newOrderModalContainer = $('#new-order-modal-container');
    this.$orderIdModalContainer = $('#order-id-modal-container');
  }

  registerButtonNewModal() {
    $('.button-new-modal').on('click', () => {
      this.restRenderer.renderNewOrderModal(this.restRepository.menu);
      let input = document.getElementById('validationCustom06');
      let autocomplete = new google.maps.places.Autocomplete(input);
      $('#newOrderModal').modal('show');
    });
  }

  // select dish option and update total on page
  registerSelectDishOption() {
    this.$newOrderModalContainer.on('change', '#validationCustom05', function(event) {
      $('#validationCustom05 option').each(function() {
        if($(this).is(':selected')) {
          $('#validationCustom04').val($(this).data('price') + '$');
          return;
        }
      });
    });
  }

  registerOnNextButtonClick() {
    this.$orderIdModalContainer.on('click', '#button-next-order', () => {
      $('#orderIdModal').modal('hide');
      this.restRenderer.renderNewOrderModal(this.restRepository.menu);
      let input = document.getElementById('validationCustom06');
      let autocomplete = new google.maps.places.Autocomplete(input);
      $('#newOrderModal').modal('show');
    });
  }

  registerSubmitOrderButton() {
    this.$newOrderModalContainer.on('submit', '#new-order-form', (event) => {
      if (document.getElementById('new-order-form').checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById('new-order-form').classList.add('was-validated');
        return;
      }
      event.stopPropagation();
      event.preventDefault();

      // get total orders from DB
      this.restRepository.getRestaurantNumOrders().then(()=> {
        let idOrder = (this.restRepository.restaurant.numOrders) + 1;
        // get information from the page form
        // get order time as string
        let timeInMs = new Date(Date.now());
        let orderTime = timeInMs.toLocaleTimeString().substring(0, 5) + ' on ' + timeInMs.toLocaleDateString().replace(/\./g, '/');
        var paymentSelection = 'cash';
        if( $('#creditCardRadio').is(':checked')) {
          paymentSelection = 'credit';
        }
        var total = $('#validationCustom04').val();
        total = total.substring(0, total.length - 1);
        // create new order object
        let newOrder = {
          name: $('#validationCustom01').val(),
          phoneNumber: $('#validationCustom02').val(),
          paymentMethod: paymentSelection,
          dishes: $('#validationCustom05').val(),
          totalPrice: total,
          status: 'received',
          isTaken: false,
          time: orderTime,
          orderId: idOrder
        };
          // get location data from google api
        let location = $('#validationCustom06').val();
        this.googleMaps.getCoords(location).then((response) => {
          // update new order location
          newOrder.location = response.results[0].formatted_address;
          // send new order to DB
          this.restRepository.addNewOrder(newOrder).then(() => {
            // get orderId and display on page
            $('#newOrderModal').modal('hide');
            $('.orderId').text(newOrder.orderId);
            this.restRenderer.renderIdModal(newOrder);
            $('#orderIdModal').modal('show');
          });
          // update restaurant number of orders on the server
          this.restRepository.updateRestaurantNumOrders(idOrder);
        });
      });
    });
  }

  registerResetButton() {
    this.$newOrderModalContainer.on('click', '.reset-button', () => {
      $('#validationCustom01').val('');
      $('#validationCustom02').val('');
      $('#validationCustom05').val('');
      $('#validationCustom06').val('');
      $('#validationCustom04').val('');
    });
  }

  loadPage() {
    this.restRepository.getRestaurantNameAndMenu().then(() => {
      $('.restaurant-name').text(this.restRepository.restaurant.name);
      this.restRenderer.renderNewOrderModal(this.restRepository.menu);
    }).catch(function (error) {
      console.log(error);
    });
  }
}

export default EventsHandler;