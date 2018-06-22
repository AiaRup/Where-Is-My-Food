class EventHandlerCustomer {
  constructor(customerRepositories, rendersCustomer) {
    this.customerRepositories = customerRepositories;
    this.rendersCustomer = rendersCustomer;
    
  }

  //User enter ID to access the costumer-time page
  submitCode() {
    $('.submit-button').click((e) =>{
      let code = $('#id-code').val();

      // RETURN CUSTOMER TIME PAGE - isnt returing page!
     this.customerRepositories.getTimePage(code).then((page)=>{
      window.location.href = page;
     })
    })
  }

  // getOrderInfo(){
  //   let id = $('#id-code').val();
  //   this.customerRepositories.orderInfo(id).then(() => {
  //     console.log('working')
  //   })
  // }

  showOrderDetails() {
    $('.order-details').click(()=> {
      console.log('div toggle')
      $('.order-info-div').toggle();
    })
  }


}

export default EventHandlerCustomer;