(function () {
  window.AppModels = {
    Rental: function Rental(data) { return { ...data, daysRequested: Number(data.daysRequested || 0), quantity: Number(data.quantity || 0) }; },
    Sale: function Sale(data) { return { ...data, total: Number(data.total || data.amount || 0), paid: Number(data.paid || 0) }; },
    InventoryItem: function InventoryItem(data) { return { ...data, total: Number(data.total || 0), available: Number(data.available || 0), rented: Number(data.rented || 0), sold: Number(data.sold || 0), repair: Number(data.repair || 0) }; },
    Client: function Client(data) { return { ...data }; },
    Event: function Event(data) { return { ...data }; },
    Service: function Service(data) { return { ...data, price: Number(data.price || 0), availability: Number(data.availability || 0) }; }
  };
})();
