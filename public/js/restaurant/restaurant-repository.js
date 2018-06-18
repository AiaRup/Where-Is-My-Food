class RestaurantRepository {
  constructor() {
    this.orders = [];
  }

  addNewOrder(newOrder) {
    return $.post('/orders', newOrder, (orderReceived)=> {
      this.orderes.push(orderReceived);
    } )
  }
}


export default RestaurantRepository;