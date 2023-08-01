import { Router } from '@vaadin/router';
import { ViewRoute, routes } from './routes.js';

export const router = new Router(document.querySelector('#outlet'));

router.setRoutes(routes);

window.addEventListener('vaadin-router-location-changed', (e) => {
  const activeRoute = router.location.route as ViewRoute;
  document.title = activeRoute.title ?? 'Hilla CRM';
});
