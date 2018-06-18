/**
     * @class Responsible for storing and manipulating Restaurand orders and employees, in-memory
     */
class DeliveryRepository {
  constructor() {
    this.employeesList = [];
    this.ordersReadyList = [];
    this.selectedOrders = [];
    this.restaurantLocation = {};
  }

  // request all the employees from the DB
  getEmployeesList() {
    return $.ajax({
      method: 'Get',
      url: 'delivery/employees',
      success: (employees) => {
        // add the employees to the array
        this.employeesList = employees;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  getOrdersReadyList() {
    return $.ajax({
      method: 'Get',
      url: 'delivery/ordersReady',
      success: (orders) => {
        // empty the array
        this.ordersReadyList = [];
        // check for the orders that are ready and not selected for delivery
        orders.forEach((order) => {
          if (!order.isTaken && order.status === 'ready') {
            this.ordersReadyList.push(order);
          }
        });
        console.log(this.ordersReadyList);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  updateOrderTaken(orderId, status, index) {
    return $.ajax({
      method: 'Put',
      url: `/orders/${orderId}`,
      data: {
        property: 'isTaken',
        value: status
      },
      success: (orders) => {
        // update order's property "isTaken" in the local array
        orders.forEach((order) => {
          if (order.orderId == orderId) {
            this.ordersReadyList[index] = order;
            console.log(order);

            console.log('order in local array updated');
            return;
          }
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  makeNewDelivery() {
    // empty selected-order array
    this.selectedOrders = [];
    // go through the array of orders and check if an order was selected to delivery
    this.ordersReadyList.forEach((order) => {
      console.log(order);
      if (order.isTaken) {
        // add the selected ones to the array
        this.selectedOrders.push(order);
      }
      console.log(this.selectedOrders);
    });
  }

  getRestaurantLocation() {
    return $.ajax({
      method: 'Get',
      url: 'delivery/restauranLocation',
      success: (location) => {
        // set local restaurant location
        this.restaurantLocation = location;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }
}


export default DeliveryRepository;