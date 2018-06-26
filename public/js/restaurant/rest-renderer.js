
class RestRenderer {
    constructor() {
        this.$newOrderModalContainer = $("#new-order-modal-container");
        this.$orderIdModalContainer = $("#order-id-modal-container");

        this.$menuSelectTemplate = $('#menu-select-template').html();
        this.$orderIdModalTemplate = $('#orderid-modal-template').html();

        this.$newOrderModalTemplate = $('#new-order-modal-template').html();

    }

    renderIdModal(newOrder) {
        this.$orderIdModalContainer.empty();
        let template = Handlebars.compile(this.$orderIdModalTemplate);
        let newHTML = template(newOrder);
        this.$orderIdModalContainer.append(newHTML);
        
    }

    renderNewOrderModal ( menu ) {
        this.$newOrderModalContainer.empty();
        let template = Handlebars.compile(this.$newOrderModalTemplate);
        let newHTML = template({});
        this.$newOrderModalContainer.append(newHTML);

        template = Handlebars.compile(this.$menuSelectTemplate);
        newHTML = "";
        for (let i=0;i<menu.length; i++) {
            newHTML += template(menu[i]);
        }
        $("#validationCustom05").append(newHTML);
              // AUTO COMPLETE ADDRESS
    //   let input = document.getElementById('validationCustom06');
    //   let autocomplete = new google.maps.places.Autocomplete(input);
      //  this.$modalContainer.find("#validationCustom05").val(order.status);
    }



}

export default RestRenderer