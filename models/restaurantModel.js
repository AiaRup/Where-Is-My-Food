let mongoose = require('mongoose');
// let Schema = mongoose.Schema;

let locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  address: String
});

let dishSchema = new mongoose.Schema({
  name: String,
  price: Number,
  amount: Number
});

let orderSchema = new mongoose.Schema({
  name: String,
  totalPrice: Number,
  time: String,
  status: String,
  paymentMethod: String,
  // location: locationSchema,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  dishes: [dishSchema],

  // dishes: [{
  //   name: {
  //     type: String,
  //     required: true
  //   },
  //   price: {
  //     type: Number,
  //     required: true
  //   },
  //   amount: Number
  // }],
  orderId: Number,
  isTaken: Boolean,

  phoneNumber: Number,
});

let employeeSchema = new mongoose.Schema({
  name: String,
  employeeId: Number
});

let restaurantSchema = new mongoose.Schema({
  name: String,
  numOrders: Number,
  menu: [dishSchema],
  address: locationSchema,
  orders: [orderSchema],
  employees: [employeeSchema],
});

let Restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = Restaurant;