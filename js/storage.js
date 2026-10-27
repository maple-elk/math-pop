// Safe Storage wrapper to guard against private browsing restrictions & quota limits
const SafeStorage = {
  _mem: {},
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return Object.prototype.hasOwnProperty.call(this._mem, key) ? this._mem[key] : null;
    }
  },
  setItem(key, val) {
    try {
      localStorage.setItem(key, String(val));
    } catch (e) {
      this._mem[key] = String(val);
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete this._mem[key];
    }
  }
};

// Global Exports
(typeof window !== "undefined" ? window : global).SafeStorage = SafeStorage;
