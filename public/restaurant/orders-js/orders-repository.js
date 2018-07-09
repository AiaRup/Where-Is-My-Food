class OrdersRepository {
  constructor() {
    this.ordersList = [];
    this.restaurant = {};
  }

  getOrderById(orderId) {
    for (var i in this.ordersList) {
      if(this.ordersList[i]['orderId'] == orderId)
        return this.ordersList[i];
    }
  }

  getOrdersList() {
    return $.ajax({
      method: 'Get',
      url: 'delivery/ordersReady',
      success: (orders) => {
        // empty the array
        this.ordersList = [];
        // sort array
        orders.sort((a, b) => {
          return b.orderId - a.orderId;
        });
        orders.forEach((order) => {
          this.ordersList.push(order);
        });
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
        this.restaurant.menu = restaurantDetails[0].menu;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  updateOrder(data) {
    return $.ajax({
      url: '/ord',
      type: 'Put',
      data: data,
      success: () => {
        $('.modal-container').find('.modal').modal('hide');
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  }

  updateOrderStatus(data) {
    return $.ajax({
      url: 'ord2',
      type: 'Put',
      data: data,
      success: () => {
        $('.modal-container').find('.modal').modal('hide');
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  }
}

export default OrdersRepository;