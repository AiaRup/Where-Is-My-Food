class RestaurantRepository {
  constructor() {
    this.orders = [];
  }

  addNewOrder(newOrder) {
    
    return $.ajax({
      method: 'Put',
      url: `/orders`,
      data: newOrder,
      success: (orders) => {
      this.orders.push(newOrder);
      console.log(this.orders)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });

  }}


export default RestaurantRepository;