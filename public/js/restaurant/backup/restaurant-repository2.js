class RestaurantRepository {
  constructor() {
    this.orders = [];
    this.restaurant = {};
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


export default RestaurantRepository;