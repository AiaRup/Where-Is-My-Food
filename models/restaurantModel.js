let mongoose = require('mongoose');


let orderSchema = new mongoose.Schema({

});

let locationSchema = new mongoose.Schema({

});

let dishSchema = new mongoose.Schema({

});

let restaurantSchema = new mongoose.Schema({

});

let Restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = Restaurant;
