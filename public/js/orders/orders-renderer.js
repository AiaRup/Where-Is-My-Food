class OrdersRenderer {
    constructor() {
        this.$ordersContainer = $(".orders-container");
        this.$orderTemplate = $('#order-template').html();
        
        this.$modalContainer = $(".modal-container");
        this.$editOrderModalTemplate = $('#edit-order-modal-template').html();
        
    }
    renderEditOrderModal( order ) {
        this.$modalContainer.empty();
        let template = Handlebars.compile(this.$editOrderModalTemplate);
        let newHTML = template(order);
        this.$modalContainer.append(newHTML);
    }
    renderOrders(orders) {
        this.$ordersContainer.empty();
        let template = Handlebars.compile(this.$orderTemplate);
        for (let i = 0; i < orders.length; i++) {
          let newHTML = template(orders[i]);
          //console.log(newHTML);
          this.$ordersContainer.append(newHTML);
          
        }
    }

    
}

export default OrdersRenderer