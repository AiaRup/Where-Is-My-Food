import EventsHandler from './rest-events-handlers.js';
import RestRenderer from './rest-renderer.js';
import RestRepository from './rest-repository.js';
import GoogleMap from '../delivery/googleMap.js';



let restRepository = new RestRepository();
let googleMap = new GoogleMap();
let restRenderer = new RestRenderer();
let eventsHandler = new EventsHandler(restRepository, restRenderer, googleMap);


eventsHandler.loadPage();
// eventsHandler.registerDeliveryButton();
// eventsHandler.registerNewOrderPageButton();
// eventsHandler.registerSaveStatusChangesButtonClicks();
eventsHandler.registerButtonNewModal();
eventsHandler.registerSelectDishOption();
eventsHandler.registerSubmitOrderButton();
eventsHandler.registerResetButton();