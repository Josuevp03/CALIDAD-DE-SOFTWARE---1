(function () {
  class LogisticsService {
    plan(routes, eventId) { return routes.filter(route => !eventId || route.eventId === eventId); }
    pending(routes) { return routes.filter(route => ['programado', 'en_transito'].includes(route.status)); }
  }
  window.LogisticsService = LogisticsService;
})();
