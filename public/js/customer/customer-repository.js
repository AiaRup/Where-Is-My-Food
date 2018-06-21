class CustomerRepository {
  constructor() {
    
  }

  getTimePage(code) {
    return $.ajax({
    method: 'Get',
    url: 'customer/' + code,
    success: (page) => { 
      console.log(page)

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

}
}

export default CustomerRepository;