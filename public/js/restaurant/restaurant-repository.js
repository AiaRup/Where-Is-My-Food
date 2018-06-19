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
      console.log(orderReceived)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });


  //   return $.put('/orders', newOrder, (orderReceived)=> {
  //     if (err) throw err;
  //     this.orders.push(newOrder);
  //     console.log(this.orders)
  //     console.log(orderReceived)
      
  //   })
    
  // }
  }}


export default RestaurantRepository;