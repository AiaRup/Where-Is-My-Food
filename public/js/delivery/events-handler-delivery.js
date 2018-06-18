class EventsHandlerDelivery {
  constructor(deliveryRepository, deliveryRenderer, googleMap) {
    this.deliveryRepository = deliveryRepository;
    this.deliveryRenderer = deliveryRenderer;
    this.googleMap = googleMap;
    this.$employees = $('.delivery-guys');
    this.$orders = $('.orders-list');
  }

  registerSelectEmployee() {
    $('.delivery-guys').on('click', '.employee', (event) => {
      let employeeName = $(event.currentTarget).data('name');
      let employeeId = $(event.currentTarget).data('id');
      // show the selected employee on the page
      $('.employee-login').toggleClass('show').text(`${employeeName} - ${employeeId}`)
        .append('<button type="button" id="change-employee" class="btn btn-outline-dark btn-sm">Change Employee</button>');
      // hide the list of employees
      $('.delivery-guys').hide();
      // ask the server for all the orders that are ready to deliver and show them on th page
      this.deliveryRepository.getOrdersReadyList().then(() => {
        // check if there is any order to deliver
        if (this.deliveryRepository.ordersReadyList.length) {
          this.deliveryRenderer.renderOrders(this.deliveryRepository.ordersReadyList);
          $('.orders-list').toggleClass('show').append('<button type="button" id="ready-to-deliver" class="btn btn-outline-dark btn-sm">Ready to Go</button>');
        } else {
          $('.msg').text('No orders are ready to deliver.').show().fadeOut(5000);
        }
      });
    });
  }

  registerChangeEmployee() {
    $('.employee-login').on('click', '#change-employee', (event) => {
      $('.employee-login').toggleClass('show');
      $('.delivery-guys').show();

      $('.orders-list').toggleClass('show');
      // Get all employees as soon as the page loads
      this.deliveryRepository.getEmployeesList().then(() => {
        // render all employees on the page
        this.deliveryRenderer.renderDeliveryList(this.deliveryRepository.employeesList);
      });
    });
  }

  registerSelectOrder() {
    $('.orders-list').on('click', '#select-to-deliver', (event) => {
      // get the order that was selected
      let $order = $(event.currentTarget).closest('.order');
      // update the order's property "isTaken"  to true
      this.deliveryRepository.updateOrderTaken($order.data('id'), true, $order.index()).then(() => {
        // show the icon "check" to see that the order was selected
        $order.find('.fa-check').toggleClass('show');
        // disable the "select order" button
        $(event.currentTarget).attr('disabled', true);
      });
    });
  }

  registerUnSelectOrder() {
    $('.orders-list').on('click', '.fa-check', (event) => {
      let $order = $(event.currentTarget).closest('.order');
      // unselect order that was previously selected
      this.deliveryRepository.updateOrderTaken($order.data('id'), false, $order.index()).then(() => {
        $order.find('.fa-check').toggleClass('show');
        $order.find('#select-to-deliver').attr('disabled', false);
      });
    });
  }

  registerReadyToGo() {
    $('.orders-list').on('click', '#ready-to-deliver', (event) => {
      this.deliveryRepository.makeNewDelivery();
      // if no order was selected to delivery
      if (!this.deliveryRepository.selectedOrders.length) {
        $('.msg').text('Please select at least one order to deliver.').show().fadeOut(5000);
        return;
      }
      // show on-delivery section
      $('.on-delivery').toggleClass('show');
      $('.before-delivery').hide();
      // show selected orders
      this.deliveryRenderer.renderOrdersToDeliver(this.deliveryRepository.selectedOrders);
      // get restaurant location
      this.deliveryRepository.getRestaurantLocation().then(() => {
        $('.restaurant-location').text(this.deliveryRepository.restaurantLocation.address);
        // ask to choose destination from the selected order list
        let orderAddress;
        this.deliveryRepository.selectedOrders.forEach((order) => {
          orderAddress += `<option value="${order.orderId}">${order.location.address}</option>`;
        });
        $('#destination').append(orderAddress);
      });
    });
  }

  registerSelectDestination() {
    $('#select-Destination').on('click', (event) => {
      let thisClass = this;
      let destinationSelect;
      let wayPoints = [];
      $('#destination option').each(function() {
        if($(this).is(':selected')) {
          // if nothing was selected (first option)
          if (($(this)).val() == 0) {
            $('.msg-select-destination').text('Please select your destination').show().fadeOut(5000);
            return;
          }
          // check for the coords of the order selected for the destination and wayPoints
          thisClass.deliveryRepository.selectedOrders.forEach((order) => {
            if (order.orderId == $(this).val()) {
              destinationSelect = order.location.address;
              // destinationSelect = { lat: order.location.latitude,
              //   lng: order.location.latitude };
              console.log('lat-lng', destinationSelect);
            } else {
              wayPoints.push(order.location.address);
              // wayPoints.push({ lat: order.location.latitude,
              //   lng: order.location.latitude });
              console.log(wayPoints);
            }
          });
        }
      });
      // get the route from the google map and display it
      // let restaurantCoords =  this.deliveryRepository.restaurantLocation.address;
      let restaurantCoords = { lat: this.deliveryRepository.restaurantLocation.latitude, lng: this.deliveryRepository.restaurantLocation.longitude };
      this.googleMap.initMap(restaurantCoords, destinationSelect, wayPoints);
      // hide the option to choose route
      $('.choose-route').hide();

    });
  }

  registerOrderDeliverd() {
    $('.orders-to-deliver').on('click', '#deliverd-complete', (event) => {
      // TODO:
      //change icon on the map
      // addapte time
      // check if all orders are delivered go back to a new
    });
  }
}

export default EventsHandlerDelivery;