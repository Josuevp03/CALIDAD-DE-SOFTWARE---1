(function () {
  class LocalStorageRepository {
    constructor(key) { this.key = key; }
    load(fallback = {}) {
      return fallback;
    }
    save(data) { return data; }
    transaction(mutator) {
      return mutator({});
    }
  }
  window.AppDataAccess = { LocalStorageRepository };
})();
