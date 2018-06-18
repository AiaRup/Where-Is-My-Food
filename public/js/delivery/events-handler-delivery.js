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
      $('.employee-login').show().text(`${employeeName} - ${employeeId}`)
        .append('<button type="button" id="change-employee" class="btn btn-outline-dark btn-sm">Change Employee</button>');
      // hide the list of employees
      $('.delivery-guys').hide();
      // ask the server for all the orders that are ready to deliver and show them on th page
      this.deliveryRepository.getOrdersReadyList().then(() => {
        // check if there is any order to deliver
        if (this.deliveryRepository.ordersReadyList.length) {
          this.deliveryRenderer.renderOrders(this.deliveryRepository.ordersReadyList);
          $('.orders-list').show().append('<button type="button" id="ready-to-deliver" class="btn btn-outline-dark btn-sm">Ready to Go</button>');
        } else {
          $('.msg').text('No orders are ready to deliver.').show().fadeOut(5000);
        }
      });
    });
  }

  registerChangeEmployee() {
    $('.employee-login').on('click', '#change-employee', (event) => {
      $('.employee-login').hide();
      $('.delivery-guys').show();

      $('.orders-list').hide();
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
        $order.find('.fa-check').show();
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
        $order.find('.fa-check').hide();
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
      // show delivery
      $('.on-delivery').show();
      $('.before-delivery').hide();
      // show selected orders
      this.deliveryRenderer.renderOrdersToDeliver(this.deliveryRepository.selectedOrders);
      // ask to choose destination



    });
  }

  registerOrderDeliverd() {
    $('.orders-to-deliver').on('click', '#deliverd-complete', (event) => {
  // TODO:
    });
  }
}

export default EventsHandlerDelivery;