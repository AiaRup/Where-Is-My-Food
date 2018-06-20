class EventsHandler {
    constructor(ordersRepository, ordersRenderer) {
        this.ordersRepository = ordersRepository;
        this.ordersRenderer = ordersRenderer;
        this.$ordersContainer = $(".orders-container");
    }
    loadPage() {
        let rootThis= this;
        this.ordersRepository.getOrdersList().then(function() { //we already handled the success scenario inside the callback
              //console.log(response );
              //console.log(this);
              rootThis.ordersRenderer.renderOrders( rootThis.ordersRepository.ordersList );
          }).catch(function(error) {
              console.log(error );
          });
    }

}

export default EventsHandler