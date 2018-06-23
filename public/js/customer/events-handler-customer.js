class EventHandlerCustomer {
  constructor(customerRepositories, rendersCustomer, googleMap) {
    this.customerRepositories = customerRepositories;
    this.rendersCustomer = rendersCustomer;
    this.googleMap = googleMap;
    this.userId = '';
    this.STORAGE_ID = 'userOrderID';
  }

  //User enter ID to access the customer-time page
  findOrder () {
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
    // let thisClass = this;
    if (window.location.hash === '#execute') {
      // get order Id from local storage
      this.getFromLocalStorage();
      this.customerRepositories.getOrderDetailes(this.userId).then(() => {
        // render data on the page
        $('.time-left').hide();
        $('.map-section').hide();
        $('.customerName').text(this.customerRepositories.userOrder.name);
        $('.orderStatus').text('order status: ' + this.customerRepositories.userOrder.status);
        $('.order-list').text('Dish: ' + this.customerRepositories.userOrder.dishes);
        $('.total-check').text('Total: ' + this.customerRepositories.userOrder.totalPrice + '$');
        if (this.customerRepositories.userOrder.status == 'ready') {
          $('.ready').addClass('active');
        } else if (this.customerRepositories.userOrder.status == 'delivered') {
          $('.ready').addClass('active');
          $('.delivered').addClass('active');
          $('.out-for-delivery').addClass('active');
        }
        // if order is 'on the way'
        if (this.customerRepositories.userOrder.status == 'out for delivery') {
          $('.ready').addClass('active');
          $('.out-for-delivery').addClass('active');
          $('.time-left').show();
          $('.map-section').show();
          $('.duration').text(this.customerRepositories.userOrder.duration + ' minutes');
          $('.queue-span').text(this.customerRepositories.userOrder.queue);
          // initialize map on the page
          let start = {};
          let end = '';
          let waypoints = [];

          for (let i = 0; i < this.customerRepositories.userOrder.mapRoute.length; i++) {
            let address = this.customerRepositories.userOrder.mapRoute[i];
            // the first address in the array
            if (!i) {
              start = address;
            // the last address in the array
            } else if (i == this.customerRepositories.userOrder.mapRoute.length-1) {
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