class EventsHandler {
    constructor(ordersRepository, ordersRenderer) {
        this.ordersRepository = ordersRepository;
        this.ordersRenderer = ordersRenderer;
        this.$table = $("table");
    }
    registerEditButtonClicks() {
        this.$table.on('click','.button-edit',function (event) {
            $("#editOrderModal").modal();
        })

    }
    registerStatusButtonClicks() {
        this.$table.on('click','.button-status',function (event) {
            $("#changeStatusModal").modal();
        })

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