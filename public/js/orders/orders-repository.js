class OrdersRepository {
    constructor() {
      this.employeesList = [];
      this.ordersList = [];
    }
    getOrderById(orderId) {
      for (var i in this.ordersList) {
          if(this.ordersList[i]['orderId'] == orderId)
            return this.ordersList[i];
        }
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
            order['location'] = this.stringfyAddress(order);  
            order['dishes'] = this.stringfyDishes(order);
            this.ordersList.push(order);
          });
          //console.log(this.ordersList);
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
    stringfyDishes(order) {
      var answer="";
      if(order.dishes.length===0)
        return answer;
      for (var i=0; i< order['dishes'].length-1 ; i++) {
        answer += order['dishes'][i]['name'] + ' , '
      }
      answer += order['dishes'][i]['name'];
      return answer;
    }
    stringfyAddress(order) {
      return  order['location']['address'];  
    }

  }
  
  
  export default OrdersRepository;