class EventsHandlerDelivery {
  constructor(deliveryRepository, deliveryRenderer) {
    this.deliveryRepository = deliveryRepository;
    this.deliveryRenderer = deliveryRenderer;
    this.$employees = $('.delivery-guys');
    this.$orders = $('.orders-list');
  }

  registerSelectEmployee() {
    $('.delivery-guys').on('click', '.employee', (event) => {
      let employeeName = $(event.currentTarget).data('name');
      let employeeId = $(event.currentTarget).data('id');

      $('.employee-login').show().text(`${employeeName} - ${employeeId}`)
        .append('<button type="button" id="change-employee" class="btn btn-outline-dark btn-sm">Change Employee</button>');

      $('.delivery-guys').hide();
      $('.orders-list').show();

      this.deliveryRepository.getOrdersReadyList().then(() => { this.deliveryRenderer.renderOrders(this.deliveryRepository.ordersReadyList);
      });
    });
  }

  registerSelectOrder() {
    $('.orders-list').on('click', '.select-to-deliver', (event) => {
      let $order = $(event.currentTarget).closest('.order');
      $('.fa-check').show();
      $(event.currentTarget).attr('disabled', true);

      this.deliveryRepository.updateOrderTaken($order.data('id'), true, $order.index());
    });
  }

  registerUnSelectOrder() {
    $('.orders-list').on('click', '.fa-check', (event) => {
      $('.fa-check').hide();
      $(event.currentTarget).attr('disabled', false);


    });
  }

  registerReadyToGo() {
    $('#ready-to-deliver').on('click', (event) => {

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
}

export default EventsHandlerDelivery;