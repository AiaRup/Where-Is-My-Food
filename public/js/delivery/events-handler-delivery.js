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
      $('.employee-login').show().text(`Employee: ${employeeName}`)
        .append('<button type="button" id="change-employee" class="btn btn-outline-dark btn-sm">Change</button>');
      // hide the list of employees
      $('.section-employees').hide();
      $('.before-delivery').toggleClass('show-employees');
      // ask the server for all the orders that are ready to deliver and show them on th page
      this.deliveryRepository.getOrdersReadyList().then(() => {
        // check if there is any order to deliver
        if (this.deliveryRepository.ordersReadyList.length) {
          $('.orders-section').show();
          this.deliveryRenderer.renderOrders(this.deliveryRepository.ordersReadyList);
        } else {
          $('.msg').text('No orders are ready to deliver.').show().fadeOut(5000);
        }
      });
    });
  }

  registerChangeEmployee() {
    $('.employee-login').on('click', '#change-employee', (event) => {
      $('.employee-login').hide();
      $('.section-employees').show();
      $('.before-delivery').toggleClass('show-employees');
      $('.orders-section').hide();
      // Get all employees as soon as the page loads
      this.deliveryRepository.getEmployeesList().then(() => {
        // render all employees on the page
        this.deliveryRenderer.renderDeliveryList(this.deliveryRepository.employeesList);
      });
    });
  }

  registerSelectOrder() {
    $('.orders-list').on('click', '.select-to-deliver', (event) => {
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
        $order.find('.select-to-deliver').attr('disabled', false);
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
      $('.on-delivery').show();
      $('.before-delivery').hide();
      // show selected orders
      this.deliveryRenderer.renderOrdersToDeliver(this.deliveryRepository.selectedOrders);
      $('.deliverd-complete').attr('disabled', true);
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
            $('.deliverd-complete').attr('disabled', false);
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
            // hide the option to choose route
            $('.choose-route').hide();
            // get restaurant coords
            let restaurantCoords = {
              lat: thisClass.deliveryRepository.restaurantLocation.latitude,
              lng: thisClass.deliveryRepository.restaurantLocation.longitude
            };
            let directionService = thisClass.googleMap.initMap(restaurantCoords);
            thisClass.googleMap.calculateAndDisplayRoute(directionService, restaurantCoords, destinationSelect, wayPoints).then((routeArray)=> {

              // update route data on the order DB
              let promiseArray = [];
              // get selected orders array from local storage
              thisClass.deliveryRepository.getFromLocalStorage();

              let arraySorted = [];
              for (var i = 0; i < routeArray.length; i++) {
                thisClass.deliveryRepository.selectedOrders.forEach((order)=> {

                  // thisClass.deliveryRepository.selectedOrders.forEach((order)=> {
                  //   for (var i = 0; i < routeArray.length; i++) {
                  if (order.location.address == routeArray[i].address) {
                    // add to the sorted array
                    arraySorted.push(order);
                    console.log('order to sorted array', order);

                    // add orderID to the route order array from google module
                    routeArray[i].orderId = order.orderId;
                    routeArray[i].queue = i;
                    let orderData = {
                      orderId: order.orderId,
                      data: {
                        property: 'mapInfo',
                        value: {
                          duration: routeArray[i].duration,
                          queue: i
                        }
                      }
                    };
                    // update orders properties in DB
                    let promise = thisClass.deliveryRepository.updateOrderProperty(orderData.orderId, orderData.data);
                    promiseArray.push(promise);
                  }
                });
              }
              // re-order orders to deliver on page by route
              console.log('array sorted', arraySorted);

              thisClass.deliveryRepository.selectedOrders = arraySorted;
              thisClass.deliveryRepository.saveToLocalStorage();
              thisClass.deliveryRenderer.renderOrdersToDeliver(thisClass.deliveryRepository.selectedOrders);
              Promise.all(promiseArray).then(function(values) {
                console.log('orders map updated', values);
              });
            });
          }
        }
      });
    });
  }

  registerOrderDeliverd() {
    $('.orders-to-deliver').on('click', '.deliverd-complete', (event) => {
      // get selected array from local storage
      this.deliveryRepository.getFromLocalStorage();
      // get the order that was delivered
      let orderID = $(event.currentTarget).closest('.order-selected').data('id');
      let $order =  $(event.currentTarget).closest('.order-selected');

      // update status of the order to "delivered"
      this.deliveryRepository.selectedOrders.forEach((order) => {
        if (order.orderId == orderID) {
          let objectToUpdate = {
            property: 'status',
            value: 'delivered'
          };
          this.deliveryRepository.updateOrderProperty(order.orderId, objectToUpdate);
        }
      });
      // update duration and queque on local google route array
      let promiseArray = [];
      let timeToSubtract = 0;
      // remove start point from the array
      if (!this.googleMap.routeOrders[0].hasOwnProperty('queue')) {
        this.googleMap.routeOrders.splice(0, 1);
      }

      for (let i = 0; i < this.googleMap.routeOrders.length; i++) {
        let order = this.googleMap.routeOrders[i];
        console.log('order in delivered', order);

        if(order.orderId == orderID) {
          timeToSubtract = order.duration;
        }
        else {
          order.duration -= timeToSubtract;
          order.queue--;
          // add to promise array
          let orderData = {
            orderId: order.orderId,
            data: {
              property: 'mapInfo',
              value: {
                duration: order.duration,
                queue: order.queue
              }
            }
          };
          console.log('orderData', orderData);

          let promise = this.deliveryRepository.updateOrderProperty(orderData.orderId, orderData.data);
          promiseArray.push(promise);
        }
      }
      // update duration and queque on order in DB
      Promise.all(promiseArray).then(function(values) {
        console.log('orders map updated', values);
      });

      // update google array - slice the order that was delivered
      this.googleMap.routeOrders.splice(0, 1);
      console.log('google map after update', this.googleMap.routeOrders);


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
          $('.on-delivery').hide();
          $('.before-delivery').show();
          $('.section-employees').show();
          $('.employee-login').hide();
          $('.orders-section').hide();
          $('.before-delivery').toggleClass('show-employees');
        }
      }
    });
  }
}

export default EventsHandlerDelivery;