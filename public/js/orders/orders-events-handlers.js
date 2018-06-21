
class EventsHandler {
    constructor(ordersRepository, ordersRenderer) {
        this.ordersRepository = ordersRepository;
        this.ordersRenderer = ordersRenderer;
        this.$table = $("table");
    }
    registerEditButtonClicks() {
        let rootThis= this;
        this.$table.on('click','.button-edit',function (event) {
            let orderId = $(this).closest('tr').find('.order-id').html();
            console.log(orderId);
            let order = rootThis.ordersRepository.getOrderById(orderId);
            console.log(order);
            rootThis.ordersRenderer.renderEditOrderModal(order);

            
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