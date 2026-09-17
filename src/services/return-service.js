(function () {
  class ReturnService {
    calculateLateFee(agreedDate, actualDate, pricePerPeriod, quantity) { const days = Math.max(0, Math.ceil((new Date(`${actualDate}T00:00:00`) - new Date(`${agreedDate}T00:00:00`)) / 86400000)); const periods = days > 0 ? Math.ceil(days / 2) : 0; return { lateDays: days, latePeriods: periods, surcharge: periods * Number(pricePerPeriod || 0) * Number(quantity || 1) }; }
    validateDate(startDate, actualDate) { return new Date(actualDate) >= new Date(startDate); }
  }
  window.ReturnService = ReturnService;
})();
