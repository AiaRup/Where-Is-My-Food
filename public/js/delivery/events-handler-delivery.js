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
      $('.employee-login').toggleClass('show').text(`Employee: ${employeeName}`)
        .append('<button type="button" id="change-employee" class="btn btn-outline-dark btn-sm">Change</button>');
      // hide the list of employees
      $('.section-employees').hide();
      $('.before-delivery').toggleClass('show-employees');
      // ask the server for all the orders that are ready to deliver and show them on th page
      this.deliveryRepository.getOrdersReadyList().then(() => {
        // check if there is any order to deliver
        if (this.deliveryRepository.ordersReadyList.length) {
          $('.orders-section').toggleClass('show');
          this.deliveryRenderer.renderOrders(this.deliveryRepository.ordersReadyList);
        } else {
          $('.msg').text('No orders are ready to deliver.').show().fadeOut(5000);
        }
      });
    });
  }

  registerChangeEmployee() {
    $('.employee-login').on('click', '#change-employee', (event) => {
      $('.employee-login').toggleClass('show');
      $('.section-employees').show();
      $('.before-delivery').toggleClass('show-employees');
      $('.orders-section').toggleClass('show');
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
      let objectToUpdate = {
        property: 'isTaken',
        value: true
      };
      this.deliveryRepository.updateOrderProperty($order.data('id'), objectToUpdate, $order.index()).then(() => {
        // show the icon "check" to see that the order was selected
        $order.find('.icon-selected').toggleClass('show');
        // disable the "select order" button
        $(event.currentTarget).attr('disabled', true);
      });
    });
  }

  registerUnSelectOrder() {
    $('.orders-list').on('click', '.icon-selected', (event) => {
      let $order = $(event.currentTarget).closest('.order');
      // unselect order that was previously selected
      let objectToUpdate = {
        property: 'isTaken',
        value: false
      };
      this.deliveryRepository.updateOrderProperty($order.data('id'), objectToUpdate, $order.index()).then(() => {
        $order.find('.icon-selected').toggleClass('show');
        $order.find('#select-to-deliver').attr('disabled', false);
      });
    });
  }

  registerReadyToGo() {
    $('.orders-section').on('click', '#ready-to-deliver', (event) => {
      $('.choose-route').show();
      $('#map').hide();
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
      $('#deliverd-complete').attr('disabled', true);
      // get restaurant location
      this.deliveryRepository.getRestaurantLocation().then(() => {
        $('.restaurant-location').text(this.deliveryRepository.restaurantLocation.address);
        // ask to choose destination from the selected order list
        $('#destination').empty();
        let orderAddress;
        this.deliveryRepository.selectedOrders.forEach((order) => {
          orderAddress += `<option value="${order.orderId}">${order.location.address}</option>`;
        });
        $('#destination').append(orderAddress);
        // save selected array to local storage
        this.deliveryRepository.saveToLocalStorage();
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
          } else {
            for (var i = 0; i < thisClass.deliveryRepository.selectedOrders.length; i++) {
              let order = thisClass.deliveryRepository.selectedOrders[i];
              // update status of order to "on delivery"
              let objectToUpdate = {
                property: 'status',
                value: 'out for delivery'
              };
              thisClass.deliveryRepository.updateOrderProperty(order.orderId, objectToUpdate, i);
            }
            // enable delivered button
            $('#deliverd-complete').attr('disabled', false);
            // check for the address of the order selected for the destination and wayPoints
            thisClass.deliveryRepository.selectedOrders.forEach((order) => {
              if (order.orderId == $(this).val()) {
                destinationSelect = order.location.address;
              } else {
                wayPoints.push(order.location.address);
              }
            });
            // get the route from the google map and display it
            $('#map').show();
            // get restaurant coords
            let restaurantCoords = {
              lat: thisClass.deliveryRepository.restaurantLocation.latitude,
              lng: thisClass.deliveryRepository.restaurantLocation.longitude
            };
            thisClass.googleMap.initMap(restaurantCoords, destinationSelect, wayPoints);
            // hide the option to choose route
            $('.choose-route').hide();
          }
        }
      });
    });
  }

  registerOrderDeliverd() {
    $('.orders-to-deliver').on('click', '#deliverd-complete', (event) => {
      // get selected array from local storage
      this.deliveryRepository.getFromLocalStorage();
      // get the order that was delivered
      let orderID = $(event.currentTarget).closest('.order-selected').data('id');
      let $order =  $(event.currentTarget).closest('.order-selected');

      // update status of the order to "delivered"
      this.deliveryRepository.selectedOrders.forEach((order) => {
        if (order.orderId == orderID) {
          // update status of order to "delivered"
          let objectToUpdate = {
            property: 'status',
            value: 'delivered'
          };
          this.deliveryRepository.updateOrderProperty(order.orderId, objectToUpdate);
        }
      });
      // hide all the order's details
      $(event.currentTarget).closest('.selected-order-content').hide();

      // add icon to delivered order
      $order.find('h5').append('<i class="fas fa-check-square"></i>');
      // splice order from selected orders array
      for (let i = 0; i < this.deliveryRepository.selectedOrders.length; i++) {
        if (this.deliveryRepository.selectedOrders[i].orderId == orderID) {
          this.deliveryRepository.selectedOrders.splice(i, 1);
          // hide segment instructions
          $('#directions-panel > div').each(function() {
            if ($(this).data('route') == $(event.currentTarget).siblings('.address').text()) {
              $(this).hide();
            }
          });

          // save array to local storage
          this.deliveryRepository.saveToLocalStorage();
        }
        // finish deliver all orders
        if (!this.deliveryRepository.selectedOrders.length) {
        // go back to select an employee
          $('.on-delivery').toggleClass('show');
          $('.before-delivery').show();
          $('.section-employees').show();
          $('.employee-login').toggleClass('show');
          $('.orders-section').toggleClass('show');
          $('.before-delivery').toggleClass('show-employees');
        }
      }
    });
  }
}

export default EventsHandlerDelivery;