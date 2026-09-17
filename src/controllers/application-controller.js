(function () {
  class ApplicationController {
    constructor({ repository, services }) { this.repository = repository; this.services = services; }
    persist(data) { return this.repository.save(data); }
    service(name) { return this.services[name]; }
  }
  window.ApplicationController = ApplicationController;
})();
