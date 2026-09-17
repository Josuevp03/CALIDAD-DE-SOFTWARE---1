(function () {
  class RentalService {
    calculateCost(startDate, returnDate, pricePerPeriod) { const days = Math.ceil((new Date(`${returnDate}T00:00:00`) - new Date(`${startDate}T00:00:00`)) / 86400000); if (days < 2) return { daysRequested: days, chargedDays: 0, periods: 0, total: 0, pricePerPeriod: Number(pricePerPeriod || 0) }; const periods = Math.ceil(days / 2); return { daysRequested: days, chargedDays: periods * 2, periods, pricePerPeriod: Number(pricePerPeriod || 0), total: periods * Number(pricePerPeriod || 0) }; }
    validatePayment(amount) { return Number(amount) > 0; }
    validateAvailability(item, quantity) { return item && Number(quantity) > 0 && item.available >= Number(quantity); }
  }
  window.RentalService = RentalService;
})();
