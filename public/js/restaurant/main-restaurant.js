import restaurantRender from './restaurant-renderer.js';
import RestaurantRepository from './restaurant-repository.js';
import EventsHandler from './events-handler-restaurant.js';
import GoogleMap from '../delivery/googleMap.js';


let restaurantRenders = new restaurantRender();
let restaurantRepositories = new RestaurantRepository();
let googleMaps = new GoogleMap();
let eventsHandlers = new EventsHandler(restaurantRepositories, restaurantRenders, googleMaps);

eventsHandlers.fillNewForm();
eventsHandlers.submitNewOrder();
eventsHandlers.addNewDish();
eventsHandlers.deleteBtn();

eventsHandlers.closePopUp();
eventsHandlers.getRestaurandData();

eventsHandlers.toOrderPage();

