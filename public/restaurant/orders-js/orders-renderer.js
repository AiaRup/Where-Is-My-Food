class OrdersRenderer {
  constructor() {
    this.$ordersContainer = $('.orders-container');
    this.$orderTemplate = $('#order-template').html();
    this.$modalContainer = $('.modal-container');
    this.$editOrderModalTemplate = $('#edit-order-modal-template').html();
    this.$editStatusModalTemplate = $('#edit-status-modal-template').html();
  }

  renderStatusModal (order) {
    this.$modalContainer.empty();
    let template = Handlebars.compile(this.$editStatusModalTemplate);
    let newHTML = template(order);
    this.$modalContainer.append(newHTML);
    this.$modalContainer.find('select').val(order.status);
  }

  renderEditOrderModal(order) {
    this.$modalContainer.empty();
    let template = Handlebars.compile(this.$editOrderModalTemplate);
    let newHTML = template(order);
    this.$modalContainer.append(newHTML);
    this.$modalContainer.find('#validationCustom05').val(order.status);
    return order.dishes;
  }

  renderOrders(orders) {
    this.$ordersContainer.empty();
    let template = Handlebars.compile(this.$orderTemplate);
    for (let i = 0; i < orders.length; i++) {
      let newHTML = template(orders[i]);
      this.$ordersContainer.append(newHTML);
    }
  }
}

export default OrdersRenderer;