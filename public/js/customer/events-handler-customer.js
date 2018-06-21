class EventHandlerCustomer {
  constructor(customerRepositories, rendersCustomer) {
    this.customerRepositories = customerRepositories;
    this.rendersCustomer = rendersCustomer;
    
  }

  //User enter ID to access the costumer-time page
  submitCode() {
    $('.submit-button').click((e) =>{
      // e.preventDefault;
      let code = $('#id-code').val();


      // RETURN CUSTOMER TIME PAGE - isnt returing page!
     this.customerRepositories.getTimePage(code).then((page)=>{
      window.location.href = page;
     })
    })
  }
}

export default EventHandlerCustomer;