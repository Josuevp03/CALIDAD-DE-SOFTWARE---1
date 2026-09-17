(function () {
  class LocalStorageRepository {
    constructor(key) { this.key = key; }
    load(fallback = {}) {
      try { return JSON.parse(localStorage.getItem(this.key)) || fallback; }
      catch (error) { console.warn('No se pudo leer la persistencia local.', error); return fallback; }
    }
    save(data) { localStorage.setItem(this.key, JSON.stringify(data)); return data; }
    transaction(mutator) {
      const data = this.load();
      const result = mutator(data);
      this.save(data);
      return result;
    }
  }
  window.AppDataAccess = { LocalStorageRepository };
})();
