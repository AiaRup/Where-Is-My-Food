class OrdersRenderer {
    constructor() {
        this.$ordersContainer = $(".orders-container");
        this.$orderTemplate = $('#order-template').html();
       // this.$commentTemplate = $('#comment-template').html();
    }

    renderOrders(orders) {
        this.$ordersContainer.empty();
        let template = Handlebars.compile(this.$orderTemplate);
        for (let i = 0; i < orders.length; i++) {
          let newHTML = template(orders[i]);
          console.log(newHTML);
          this.$ordersContainer.append(newHTML);
          
        }
    }

    
}

export default OrdersRenderer