import restaurantRender from './restaurant-renderer.js';
import RestaurantRepository from './restaurant-repository.js';
import EventsHandler from './events-handler-restaurant.js';


let restaurantRenders = new restaurantRender();
let restaurantRepositories = new RestaurantRepository();
let eventsHandlers = new EventsHandler(restaurantRepositories, restaurantRenders);

eventsHandlers.fillNewForm();
eventsHandlers.submitNewOrder();
eventsHandlers.closePopUp();