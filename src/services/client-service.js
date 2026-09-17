(function () {
  class ClientService {
    constructor(repository) { this.repository = repository; }
    search(clients, term) { const value = String(term || '').toLowerCase(); return clients.filter(client => [client.firstName, client.lastName, client.document, client.phone, client.city].some(field => String(field || '').toLowerCase().includes(value))); }
    save(clients, client) { const index = clients.findIndex(item => item.id === client.id); if (index >= 0) clients[index] = client; else clients.push(client); return client; }
  }
  window.ClientService = ClientService;
})();
