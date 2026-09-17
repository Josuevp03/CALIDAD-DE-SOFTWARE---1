(function () {
  class SaleService {
    calculateTotal(items) { return items.reduce((total, item) => total + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0); }
    validateFullPayment(total, paid) { return Number(total) === Number(paid); }
    validateAvailability(items, inventory) { return items.every(item => { const stock = inventory.find(row => row.id === Number(item.packageId)); return stock && stock.available >= Number(item.quantity); }); }
  }
  window.SaleService = SaleService;
})();
