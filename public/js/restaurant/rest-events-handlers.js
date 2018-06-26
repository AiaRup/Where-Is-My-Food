class EventsHandler {
  constructor(restRepository, restRenderer, googleMaps) {
    this.restRepository = restRepository;
    this.restRenderer = restRenderer;
    this.googleMaps = googleMaps;
    this.$newOrderModalContainer = $('#new-order-modal-container');
  }
  
  registerButtonNewModal() {
    let rootThis=this;
    $(".button-new-modal").on('click',function(event) {
      rootThis.restRenderer.renderNewOrderModal(rootThis.restRepository.menu);
  
      let input = document.getElementById('validationCustom06');
      let autocomplete = new google.maps.places.Autocomplete(input);
      $("#newOrderModal").modal('show');
      // AUTO COMPLETE ADDRESS

    })
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


  registerSubmitOrderButton() {
    let rootThis=this;
    this.$newOrderModalContainer.on('submit','#new-order-form',(event) => {
      // alert("inside submit");

        // if (this.checkValidity() === false) {
          if (document.getElementById('new-order-form').checkValidity() === false) {
          // alert("inside if");

          event.preventDefault();
          event.stopPropagation();
          document.getElementById('new-order-form').classList.add('was-validated');
          return;
        }
     event.stopPropagation();
    // alert("after if");
      event.preventDefault();
      // alert("after if");

      // get total orders from DB
      rootThis.restRepository.getRestaurantNumOrders().then(()=> {
        let idOrder = (rootThis.restRepository.restaurant.numOrders) + 1;
        // get information from the page form
        // get order time as string
        let timeInMs = new Date(Date.now());
        let orderTime = timeInMs.toLocaleTimeString().substring(0, 5) + ' on ' + timeInMs.toLocaleDateString().replace(/\./g, '/');
        var paymentSelection = "cash";
        if( $('#creditCardRadio').is(':checked')) {
          paymentSelection = "credit";
        }
        var total = $('#validationCustom04').val();
        total = total.substring(0, total.length - 1);
        // create new order object
        let newOrder = {
          name: $('#validationCustom01').val(),
          phoneNumber: $('#validationCustom02').val(),
          paymentMethod: paymentSelection,

          // dishes: $('.dish-list li').data('dish'),
          dishes: $('#validationCustom05').val(),
          totalPrice: total,
          status: 'received',
          isTaken: false,
          time: orderTime,
          orderId: idOrder
        };

        // get location data from google api
        let location = $('#validationCustom06').val();
        rootThis.googleMaps.getCoords(location).then((response) => {
          // update new order location
          newOrder.location = response.results[0].formatted_address;
          // send new order to DB
          console.log(newOrder);
          rootThis.restRepository.addNewOrder(newOrder).then(() => {
          // get orderId and display on page
            $('#newOrderModal').modal('hide');
            $('.orderId').text(newOrder.orderId);
            rootThis.restRenderer.renderIdModal(newOrder);
            $('#orderIdModal').modal('show');
          });
          // update restaurant number of orders on the server
          rootThis.restRepository.updateRestaurantNumOrders(idOrder);
        });
      });
    });
  }
  loadPage() {
    let rootThis = this;
    this.restRepository.getMenu().then(function () { //we already handled the success scenario inside the callback
      //console.log(response );
      //console.log(this);
      rootThis.restRenderer.renderNewOrderModal(rootThis.restRepository.menu);
    }).catch(function (error) {
      console.log(error);
    });
  }


}

export default EventsHandler;