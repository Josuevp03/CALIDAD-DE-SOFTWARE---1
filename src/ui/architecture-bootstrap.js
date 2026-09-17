(function () {
  const repository = new AppDataAccess.LocalStorageRepository('decoraciones_fiesta_boliviana_db');
  const authentication = new AppAuthentication.AuthenticationService(repository, 'decoraciones_fiesta_boliviana_session');
  const inventoryService = new InventoryService(repository);
  const services = {
    rental: new RentalService(), sale: new SaleService(), inventory: inventoryService, returns: new ReturnService(), manufacturing: new ManufacturingService(), client: new ClientService(repository), event: new EventService(repository), logistics: new LogisticsService(), report: new ReportService()
  };
  window.AppArchitecture = { repository, authentication, services, controller: new ApplicationController({ repository, services }) };
})();
