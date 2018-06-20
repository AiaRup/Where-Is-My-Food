const mongoose = require('mongoose');
const { Schema } = mongoose;

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
  location: { type: Schema.Types.Mixed, default: {} },
  // location: {
  //   latitude: Number,
  //   longitude: Number,
  //   address: String
  // },
  dishes: [dishSchema],
  mapInfo: { type: Schema.Types.Mixed, default: {} },
  orderId: Number,
  isTaken: Boolean,
  phoneNumber: Number
}, { minimize: false });

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
  employees: [employeeSchema]
});

let Restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = Restaurant;