class RestRepository {
    constructor() {
      this.restaurant = {};
      this.menu = {};
      this.orders = [];
    }

    getMenu() {
      let rootThis=this;
      return $.ajax({
        method: 'Get',
        url: "ord/menu",
        success: (menu) => {
          rootThis.menu = menu;
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      })
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
            // order['location'] = this.stringfyAddress(order);
            // order['dishes'] = this.stringfyDishes(order);
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


    addNewOrder(newOrder) {
      return $.ajax({
        method: 'Put',
        url: '/orders',
        data:newOrder,
        success: (orders) => {
          console.log('order added to DB');
  
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
    }
  
    getRestaurantNameAndMenu() {
      return $.ajax({
        method: 'Get',
        url: 'restaurant/restauranNameMenu',
        success: (restaurantDetails) => {
          console.log(restaurantDetails);
          // add name and menu to object
          this.restaurant.name = restaurantDetails[0].name;
          this.restaurant.menu = restaurantDetails[0].menu;
  
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
    }
  
    getRestaurantNumOrders() {
      return $.ajax({
        method: 'Get',
        url: 'restaurant/restauranNumOrders',
        success: (restaurantDetails) => {
          // add number of orders to object
          this.restaurant.numOrders = restaurantDetails[0].numOrders;
  
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
    }
  
    updateRestaurantNumOrders(numOrders) {
      return $.ajax({
        method: 'Put',
        url: 'restaurant/restauranNumOrders',
        data: {
          ordersNumber: numOrders
        },
        success: (restaurantDetails) => {
          console.log('Number of orders updated in DB');
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
    }
  }
  
    // getRestaurantNameAndMenu() {
    //   return $.ajax({
    //     method: 'Get',
    //     url: 'restaurant/restauranNameMenu',
    //     success: (restaurantDetails) => {
    //       console.log(restaurantDetails);
    //       // add name and menu to object
    //       this.restaurant.menu = restaurantDetails[0].menu;
    //       },
    //     error: function(jqXHR, textStatus, errorThrown) {
    //       console.log(textStatus);
    //     }
    //   });
    // }

  


  export default RestRepository;