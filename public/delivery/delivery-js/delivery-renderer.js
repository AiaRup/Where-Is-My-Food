class DeliveryRenderer {
  constructor() {
    this.$deliveryList = $('.employeesList');
    this.$ordersList = $('.orders-list');
    this.$ordersToDeliverList = $('.orders-deliver-list');
    this.$ordersMapList = $('.orders-map-list');
    this.$deliveryTemplate = $('#delivery-template').html();
    this.$orderTemplate = $('#orders-template').html();
    this.$orderToDeliverTemplate = $('#readyToDeliverOrders-template').html();
  }

  renderDeliveryList(employees) {
    this.$deliveryList.empty();
    let template = Handlebars.compile(this.$deliveryTemplate);
    for (let i = 0; i < employees.length; i++) {
      let newHTML = template(employees[i]);
      this.$deliveryList.append(newHTML);
    }
  }

  renderOrders(orders) {
    this.$ordersList.empty();
    let template = Handlebars.compile(this.$orderTemplate);
    for (let i = 0; i < orders.length; i++) {
      let newHTML = template(orders[i]);
      this.$ordersList.append(newHTML);
    }
  }

  renderOrdersToDeliver(orders) {
    this.$ordersToDeliverList.empty();
    this.$ordersMapList.empty();
    let template = Handlebars.compile(this.$orderToDeliverTemplate);
    for (let i = 0; i < orders.length; i++) {
      let newHTML = template(orders[i]);
      this.$ordersToDeliverList.append(newHTML);
      this.$ordersMapList.append(newHTML);
    }
  }
}

export default DeliveryRenderer;