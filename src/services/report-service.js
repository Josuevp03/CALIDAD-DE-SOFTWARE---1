(function () {
  class ReportService {
    inRange(date, from, to) { const value = String(date || '').slice(0, 10); return value && (!from || value >= from) && (!to || value <= to); }
    summarize(records, dateField, from, to) { return records.filter(record => this.inRange(record[dateField], from, to)); }
  }
  window.ReportService = ReportService;
})();
