let mongoose = require('mongoose');

let locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  }
});

let dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

let orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'received'
  },
  paidMethod: {
    type: String,
    required: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  dishes: {
    type: [dishSchema],
    required: true
  },
  orderId: {
    type: Number,
    required: true,
    unique: true
  },
  isTaken: {
    type: Boolean,
    required: true,
    default: false
  },
  phoneNumber: {
    type: Number,
    min : 1000000000,
    max : 9999999999
  }
});

let employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  employeeId: {
    type: Number,
    required: true,
    unique: true
  }
});

let restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  menu: {
    type: [dishSchema],
    required: true
  },
  address: {
    type: locationSchema,
    required: true
  },
  orders: {
    type: [orderSchema],
    required: true
  },
  employees: {
    type: [employeeSchema],
    required: true
  }
});

let Restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = Restaurant;