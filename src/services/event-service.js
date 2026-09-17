(function () {
  class EventService {
    constructor(repository) { this.repository = repository; }
    upcoming(events, today = new Date()) { return events.filter(event => new Date(`${event.date}T00:00:00`) >= today).sort((a, b) => a.date.localeCompare(b.date)); }
    forClient(events, clientName) { return events.filter(event => event.client === clientName); }
  }
  window.EventService = EventService;
})();
