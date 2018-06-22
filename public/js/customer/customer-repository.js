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

//New get order from server
//   orderInfo(id) {
//     return $.ajax({
//     method: 'Get',
//     url: `customer/${id}/info/`,
//     success: (page) => { 
//       console.log(page)

//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     }
//   });
// }


}

export default CustomerRepository;