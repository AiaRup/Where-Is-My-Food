
class EventsHandler {
    constructor(ordersRepository, ordersRenderer) {
        this.ordersRepository = ordersRepository;
        this.ordersRenderer = ordersRenderer;
        this.$table = $("table");
        this.$modalContainer = $(".modal-container");
    }
    registerDeliveryButton() {
        $(".delivery-button").on('click',function(event) {
            event.preventDefault();
            window.location.href = "/delivery";       
             
        })
    }
    registerNewOrderPageButton() {
        $(".new-order-button").on('click',function(event) {
            event.preventDefault();
            window.location.href = "/";       
             
        })
    }
    registerSaveStatusChangesButtonClicks () {
        let rootThis = this;
        this.$modalContainer.on('submit','.edit-status-form', function (event) { 
            
            event.preventDefault();
            //let data = $(this).serialize();
            let data = {
                            name:"",
                            // location:"",
                            // phoneNumber:"",
                            // totalPrice:"",
                            orderId:"",
                            status:""
                        }; 

            data.name = $(this).find("#validationCustom11").val();
            // data.location = $(this).find("#validationCustom03").val();
            // data.phoneNumber = $(this).find("#validationCustom02").val();
            data.status = $(this).find("#status-select").val();
            // data.totalPrice = $(this).find("#validationCustom04").val();
            data.orderId = $(this).find("#validationCustom10").val();
            // console.log("gggggggggggggggggg"+data);
            $.ajax({
                url: `ord2`,
                type: 'Put',
                data: data,
                success: function(msg) {
                    rootThis.$modalContainer.find('.modal').modal('hide');
                    rootThis.loadPage.call(rootThis);

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                }            
            });
        })
    }

    registerSaveEditedOrderButtonClicks () {
        let rootThis = this;
        this.$modalContainer.on('submit','.edit-order-form', function (event) { 
            
            event.preventDefault();
            //let data = $(this).serialize();
            let data = {
                            name:"",
                            location:"",
                            phoneNumber:"",
                            totalPrice:"",
                            orderId:"",
                            status:""
                        }; 
            data.name = $(this).find("#validationCustom01").val();
            data.location = $(this).find("#validationCustom03").val();
            data.phoneNumber = $(this).find("#validationCustom02").val();
            data.status = $(this).find("#validationCustom05").val();
            data.totalPrice = $(this).find("#validationCustom04").val();
            data.orderId = $(this).find("#validationCustom07").val();
            $.ajax({
                url: `ord`,
                type: 'Put',
                data: data,
                success: function(msg) {
                    rootThis.$modalContainer.find('.modal').modal('hide');
                    rootThis.loadPage.call(rootThis);

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                }            
            });
        })
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
        let rootThis= this;
        this.$table.on('click','.button-status',function (event) {
            let orderId = $(this).closest('tr').find('.order-id').html();
            console.log(orderId);
            let order = rootThis.ordersRepository.getOrderById(orderId);
            console.log(order);
            rootThis.ordersRenderer.renderStatusModal(order);

                     
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