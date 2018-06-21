class OrdersRepository {
    constructor() {
      this.employeesList = [];
      this.ordersList = [];
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
  
    getOrdersList() {
      return $.ajax({
        method: 'Get',
        url: 'delivery/ordersReady',
        success: (orders) => {
          // empty the array
          this.ordersList = [];
          // check for the orders that are ready and not selected for delivery
          orders.forEach((order) => {
            if ( order.status === 'received' &&) {
              this.ordersList.push(order);
            }
          });
          console.log(this.ordersList);
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
              this.ordersList[index] = order;
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

  }
  
  
  export default OrdersRepository;