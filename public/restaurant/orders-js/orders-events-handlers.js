class EventsHandler {
  constructor(ordersRepository, ordersRenderer, googleMaps) {
    this.ordersRepository = ordersRepository;
    this.ordersRenderer = ordersRenderer;
    this.googleMaps = googleMaps;
    this.$table = $('table');
    this.$modalContainer = $('.modal-container');
  }

  registerDeliveryButton() {
    $('.delivery-button').on('click', function (event) {
      event.preventDefault();
      window.location.href = '/delivery';
    });
  }

  registerNewOrderPageButton() {
    $('.new-order-button').on('click', function (event) {
      event.preventDefault();
      window.location.href = '/';

    });
  }

  registerSaveStatusChangesButtonClicks() {
    let rootThis = this;
    this.$modalContainer.on('submit', '.edit-status-form', function (event) {
      event.preventDefault();
      let data = {};
      data.name = $(this).find('#validationCustom11').val();
      data.status = $(this).find('#status-select').val();
      data.orderId = $(this).find('#validationCustom10').val();
      rootThis.ordersRepository.updateOrderStatus(data).then(() => {
        rootThis.loadPage.call(rootThis);
      });
    });
  }

  // select dish option and update total on page
  registerSelectDishOption() {
    this.$modalContainer.on('change', '#validationCustom03', function () {
      $('#validationCustom03 option').each(function () {
        if ($(this).is(':selected')) {
          $('#validationCustom04').val($(this).data('price') + '$');
          return;
        }
      });
    });
  }

  registerSaveEditedOrderButtonClicks() {
    let rootThis = this;
    this.$modalContainer.on('submit', '.edit-order-form', function (event) {
      if (this.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        this.classList.add('was-validated');
        return;
      }
      event.preventDefault();
      let data = {};
      data.name = $(this).find('#validationCustom01').val();
      data.phoneNumber = $(this).find('#validationCustom02').val();
      data.status = $(this).find('#validationCustom05').val();
      data.orderId = $(this).find('#validationCustom07').val();
      // get selected dish and total price
      data.dishes = $(this).find('#validationCustom03').val();
      data.totalPrice = $(this).find('#validationCustom04').val();
      // get location data from google api
      let location = $(this).find('#validationCustom06').val();
      rootThis.googleMaps.getCoords(location).then((response) => {
        // update order location
        data.location = response.results[0].formatted_address;
        // send updated order to DB
        rootThis.ordersRepository.updateOrder(data).then(() => {
          rootThis.loadPage.call(rootThis);
        });
      });
    });
  }

  registerEditButtonClicks() {
    this.$table.on('click', '.button-edit', (event) => {
      let orderId = $(event.currentTarget).closest('tr').find('.order-id').html();
      let order = this.ordersRepository.getOrderById(orderId);
      let orderDishes = this.ordersRenderer.renderEditOrderModal(order);
      // get restaurant menu
      this.ordersRepository.getRestaurantNameAndMenu().then(() => {
        // get menu from result array
        let dishOption;
        this.ordersRepository.restaurant.menu.forEach((dish) => {
          dishOption += `<option value="${dish.name}" data-price="${dish.price}">${dish.name}</option>`;
        });
        $('#validationCustom03').append(dishOption);
        $('#validationCustom03').val(orderDishes);
      });
      // AUTO COMPLETE ADDRESS
      let input = document.getElementById('validationCustom06');
      let autocomplete = new google.maps.places.Autocomplete(input);
      $('#editOrderModal').modal();
    });
  }

  registerStatusButtonClicks() {
    this.$table.on('click', '.button-status', (event) => {
      let orderId = $(event.currentTarget).closest('tr').find('.order-id').html();
      let order = this.ordersRepository.getOrderById(orderId);
      this.ordersRenderer.renderStatusModal(order);
      $('#changeStatusModal').modal();
    });
  }

  loadPage() {
    this.ordersRepository.getOrdersList().then(() => {
      this.ordersRenderer.renderOrders(this.ordersRepository.ordersList);
    }).catch((error) => {
      console.log(error);
    });
  }

  refresh() {
    $('#refreshOrders').on('click', () => {
      this.loadPage();
    });
  }
}

export default EventsHandler;