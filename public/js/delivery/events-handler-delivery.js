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
          console.log('orders ready', this.deliveryRepository.ordersReadyList);

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
          orderAddress += `<option value="${order.orderId}">${order.location}</option>`;
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
      $('#destination option').each(function () {
        if ($(this).is(':selected')) {
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
              // get destination address
              if (order.orderId == $(this).val()) {
                destinationSelect = order.location;
                // get points to stop on the way
              } else {
                wayPoints.push(order.location);
              }
            });
            // show map on page
            $('#map').show();
            // hide the option to choose route
            $('.choose-route').hide();
            /*=============================================
            get the route from the google map and display it
            ==============================================*/
            // get restaurant coords
            let restaurantCoords = {
              lat: thisClass.deliveryRepository.restaurantLocation.latitude,
              lng: thisClass.deliveryRepository.restaurantLocation.longitude
            };
            // initialize map on the page
            let directionService = thisClass.googleMap.initMap(restaurantCoords);
            // get route
            thisClass.googleMap.calculateAndDisplayRoute(directionService, restaurantCoords, destinationSelect, wayPoints).then((routeArray) => {
              /*==================================
               update route data on the order DB
              ===================================*/
              let promiseArray = [];
              let arraySorted = [];

              // get selected orders array from local storage
              thisClass.deliveryRepository.getFromLocalStorage();

              for (let i = 0; i < routeArray.length; i++) {
                thisClass.deliveryRepository.selectedOrders.forEach((order) => {

                  if (order.location == routeArray[i].address) {
                    // add to the sorted array
                    arraySorted.push(order);

                    // add orderID and queue to the route order array from google module
                    routeArray[i].orderId = order.orderId;
                    routeArray[i].queue = i;
                    var orderData = {
                      orderId: order.orderId,
                      data: {
                        property: 'queue',
                        value: i
                      }
                    };
                    var orderData2 = {
                      orderId: order.orderId,
                      data: {
                        property: 'duration',
                        value: routeArray[i].duration
                      }
                    };

                    // update orders properties in DB
                    let promise = thisClass.deliveryRepository.updateOrderProperty(orderData.orderId, orderData.data);
                    let promise2 = thisClass.deliveryRepository.updateOrderProperty(orderData2.orderId, orderData2.data);

                    promiseArray.push(promise);
                    promiseArray.push(promise2);

                    // add array routes to each order
                    routeArray.forEach((orderAddress) => {
                      var orderMapRoute = {
                        orderId: order.orderId,
                        addressValue: orderAddress.address
                      };
                      let promise3 = thisClass.deliveryRepository.updateMapInfoOfOrder(orderMapRoute.orderId, orderMapRoute.addressValue);
                      promiseArray.push(promise3);
                    });
                  }
                });
              }
              // update queue and duration on all orders
              Promise.all(promiseArray).then(function (values) {
                console.log('orders map updated', values);
              });
              // update array on repository as the sorted array
              thisClass.deliveryRepository.selectedOrders = arraySorted;
              thisClass.deliveryRepository.saveToLocalStorage();
              // render the orders by route on the page
              thisClass.deliveryRenderer.renderOrdersToDeliver(thisClass.deliveryRepository.selectedOrders);
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
      let $order = $(event.currentTarget).closest('.order-selected');

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
        // get the time that passed until the deliver
        if (order.orderId == orderID) {
          timeToSubtract = order.duration;
        } else {
          order.duration -= timeToSubtract;
          order.queue--;
          // add to promise array
          var orderData = {
            orderId: order.orderId,
            data: {
              property: 'duration',
              value: order.duration
            }
          };
          var orderData2 = {
            orderId: order.orderId,
            data: {
              property: 'queue',
              value: order.queue
            }
          };
          let promise = this.deliveryRepository.updateOrderProperty(orderData.orderId, orderData.data);
          let promise2 = this.deliveryRepository.updateOrderProperty(orderData2.orderId, orderData2.data);
          promiseArray.push(promise);
          promiseArray.push(promise2);
        }
      }
      // update duration and queque on order in DB
      Promise.all(promiseArray).then(function (values) {
        console.log('all orders after update duration and queue', values);
      });

      // update google array - splice the order that was delivered
      this.googleMap.routeOrders.splice(0, 1);

      // hide all the delivered order's details
      $(event.currentTarget).closest('.selected-order-content').hide();
      // add icon to delivered order
      $order.find('h5').append('<i class="fas fa-check-square"></i>');
      // splice order from selected orders array
      for (let i = 0; i < this.deliveryRepository.selectedOrders.length; i++) {
        if (this.deliveryRepository.selectedOrders[i].orderId == orderID) {
          this.deliveryRepository.selectedOrders.splice(i, 1);
          // save array to local storage
          this.deliveryRepository.saveToLocalStorage();
          // hide segment instructions
          $('#directions-panel > div').each(function () {
            if ($(this).data('route') == $(event.currentTarget).siblings('.address').text()) {
              $(this).hide();
            }
          });
        }
        // if finished deliver all orders
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

  //open each order seperatly
  openOrderDelivery() {
    $('.toggle-order').hide();
    $(document).on('click', '.order' ,(e)=> { 
    $(e.currentTarget).find('.toggle-order').toggle()
  })
  }

}

export default EventsHandlerDelivery;

// 1
// 2
// 3
// $( "#foo" ).bind( "mouseenter mouseleave", function() {
//   $( this ).toggleClass( "entered" );
// });