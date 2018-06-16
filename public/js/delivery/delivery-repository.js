/**
     * @class Responsible for storing and manipulating Restaurand orders and employees, in-memory
     */
class DeliveryRepository {
  constructor() {
    this.employeesList = [];
    this.ordersReadyList = [];
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
        this.ordersReadyList = [];
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
      url: '/orders/:orderId\'',
      data: {
        property: 'isTaken',
        value: status
      },
      success: (updatedOrder) => {
        this.ordersReadyList[index] = updatedOrder;
        console.log('order in local array updated');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }
}

export default DeliveryRepository;