(function () {
  class InventoryService {
    constructor(repository) { this.repository = repository; }
    move(inventory, packageId, type, quantity) {
      const item = inventory.find(row => row.id === Number(packageId));
      const amount = Number(quantity);
      if (!item || !Number.isInteger(amount) || amount <= 0) return { success: false, message: 'Paquete o cantidad inválida.' };
      if (['sale', 'rental', 'repair'].includes(type) && item.available < amount) return { success: false, message: 'Inventario insuficiente.' };
      if (type === 'return' && item.rented < amount) return { success: false, message: 'La devolución supera las unidades alquiladas.' };
      if (type === 'sale') { item.available -= amount; item.sold += amount; }
      if (type === 'rental') { item.available -= amount; item.rented += amount; }
      if (type === 'return') { item.rented -= amount; item.available += amount; }
      if (type === 'repair') { item.available -= amount; item.repair += amount; }
      item.stock = item.available;
      return { success: true, item };
    }
    completeManufacturing(inventory, packageId, quantity) { const item = inventory.find(row => row.id === Number(packageId)); if (!item) return { success: false }; item.total += Number(quantity); item.available += Number(quantity); item.stock = item.available; return { success: true, item }; }
  }
  window.InventoryService = InventoryService;
})();
