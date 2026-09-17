(function () {
  class ManufacturingService {
    complete(record, inventoryService, inventory) { if (!record || record.status === 'completada') return { success: false, message: 'Fabricación inválida o ya completada.' }; const result = inventoryService.completeManufacturing(inventory, record.packageId, record.quantity); if (result.success) record.status = 'completada'; return result; }
    efficiency(records) { const values = records.map(record => Number(record.efficiency || 0)).filter(value => value > 0); return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null; }
  }
  window.ManufacturingService = ManufacturingService;
})();
