import EventsHandler from './orders-events-handlers.js'; 
import OrdersRenderer from './orders-renderer.js';
import OrdersRepository from './orders-repository.js';


let ordersRepository = new OrdersRepository();
let ordersRenderer = new OrdersRenderer();
let eventsHandler = new EventsHandler(ordersRepository, ordersRenderer);

 
eventsHandler.loadPage();
eventsHandler.registerEditButtonClicks();
eventsHandler.registerStatusButtonClicks();
eventsHandler.registerSaveEditedOrderButtonClicks();