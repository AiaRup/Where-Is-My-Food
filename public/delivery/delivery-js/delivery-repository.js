/**
     * @class Responsible for storing and manipulating Restaurand orders and employees, in-memory
     */
class DeliveryRepository {
  constructor() {
    this.employeesList = [];
    this.ordersReadyList = [];
    this.selectedOrders = [];
    this.restaurantLocation = {};
    this.STORAGE_ID = 'selectedOrders';
  }

  // request all the employees from the DB
  getEmployeesList() {
    return $.ajax({
      method: 'Get',
      url: '/delivery/employees',
      success: (employees) => {
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
      url: '/delivery/ordersReady',
      success: (orders) => {
        // empty the array
        this.ordersReadyList = [];
        // check for the orders that are ready and not selected for delivery
        orders.forEach((order) => {
          if (!order.isTaken && order.status === 'ready') {
            this.ordersReadyList.push(order);
          }
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  updateOrderProperty(orderId, objectToUpdate, index) {
    return $.ajax({
      method: 'Put',
      url: `/orders/${orderId}`,
      data: objectToUpdate,
      success: (orders) => {
        if (objectToUpdate.property == 'isTaken') {
        // update order's property "isTaken" in the local array
          orders.forEach((order) => {
            if (order.orderId == orderId) {
              this.ordersReadyList[index] = order;
              return;
            }
          });
        }
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
      if (order.isTaken) {
        // add the selected ones to the array
        this.selectedOrders.push(order);
      }
    });
  }

  getRestaurantLocation() {
    return $.ajax({
      method: 'Get',
      url: '/delivery/restauranLocation',
      success: (location) => {
        // set local restaurant location
        this.restaurantLocation = location;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  updateMapInfoOfOrder(orderId, mapInfo) {
    return $.ajax({
      method: 'Put',
      url: `/orders/${orderId}/map`,
      dataType: 'json',
      data: {
        address: mapInfo
      },
      success: (orders) => {
        orders.forEach((order) => {
          if(order.orderId == orderId) {
            console.log('order updated with route array', order);
          }
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  saveToLocalStorage() {
    localStorage.setItem(this.STORAGE_ID, JSON.stringify(this.selectedOrders));
  }

  getFromLocalStorage() {
    this.selectedOrders = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
  }
}

export default DeliveryRepository;