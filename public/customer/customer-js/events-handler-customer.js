class EventHandlerCustomer {
  constructor(customerRepositories, googleMap) {
    this.customerRepositories = customerRepositories;
    this.googleMap = googleMap;
    this.userId = '';
    this.STORAGE_ID = 'userOrderID';
  }

  //User enter ID to access the customer-time page
  findOrder() {
    $('.submit-button').click((event) => {
      event.preventDefault();
      let userOrderId = $('#id-code').val();

      if (!userOrderId) {
        $('.msg').text('Please enter your order number').show().fadeOut(5000);
        return;
      }
      // check in the DB if there is such order
      this.customerRepositories.getOrderDetailes(userOrderId).then(() => {
        // order exist
        if (this.customerRepositories.status) {
          // save order id localy
          this.userId = userOrderId;
          this.saveToLocalStorage();
          // RETURN CUSTOMER TIME PAGE
          window.location.href = '/customerTime#execute';
        } else {
        // no order was found
          $('.msg').text(`UPS! We can't find order number ${userOrderId}!`).show().fadeOut(5000);
        }
      });
    });
  }

  renderOrderDetails() {
    if (window.location.hash === '#execute') {
      // get order Id from local storage
      this.getFromLocalStorage();
      this.customerRepositories.getOrderDetailes(this.userId).then(() => {
        // render data on the page
        let order = this.customerRepositories.userOrder;
        $('.on-delivery').hide();
        $('.customerName').text(order.name);
        $('.order-list').text(order.dishes);
        $('.total-check').text('Total: ' + order.totalPrice + '$');
        if (order.status == 'ready') {
          $('.ready').addClass('active');
        } else if (order.status == 'delivered') {
          $('.ready').addClass('active');
          $('.delivered').addClass('active');
          $('.out-for-delivery').addClass('active');
        }
        // if order is 'on the way'
        if (order.status == 'out for delivery') {
          $('.ready').addClass('active');
          $('.out-for-delivery').addClass('active');
          $('.on-delivery').show();
          // $('.map-section').show();
          $('.duration').html('<span id="minute">' + order.duration + '</span> minutes');
          $('.queue-span').text(order.queue);
          // initialize map on the page
          let start = {};
          let end = '';
          let waypoints = [];

          for (let i = 0; i < order.mapRoute.length; i++) {
            let address = order.mapRoute[i];
            // the first address in the array
            if (!i) {
              start = address;
            // the last address in the array
            } else if (i == order.mapRoute.length - 1) {
              end = address;
            }
            else {
              waypoints.push(address);
            }
          }
          // get coords of origin address
          this.googleMap.getCoords(start).then((response) => {
            start = {
              lat: response.results[0].geometry.location.lat,
              lng: response.results[0].geometry.location.lng
            };
            // init map
            let directionService = this.googleMap.initMap(start);
            // get route
            this.googleMap.calculateAndDisplayRoute(directionService, start, end, waypoints, false);
          });
        }
      });
    }
  }

  refreshPage() {
    $('#refresh').on('click', ()=> {
      window.location.reload(true);
    });
  }

  saveToLocalStorage() {
    localStorage.setItem(this.STORAGE_ID, this.userId);
  }

  getFromLocalStorage() {
    this.userId = localStorage.getItem(this.STORAGE_ID) || '';
  }
}

export default EventHandlerCustomer;