import EventsHandler from './orders-events-handlers.js';
import OrdersRenderer from './orders-renderer.js';
import OrdersRepository from './orders-repository.js';
import GoogleMap from '../delivery/googleMap.js';



let ordersRepository = new OrdersRepository();
let googleMap = new GoogleMap();
let ordersRenderer = new OrdersRenderer();
let eventsHandler = new EventsHandler(ordersRepository, ordersRenderer, googleMap);


eventsHandler.loadPage();
eventsHandler.registerEditButtonClicks();
eventsHandler.registerStatusButtonClicks();
eventsHandler.registerSaveEditedOrderButtonClicks();
eventsHandler.registerDeliveryButton();
eventsHandler.registerNewOrderPageButton();
eventsHandler.registerSaveStatusChangesButtonClicks();
eventsHandler.registerSelectDishOption();