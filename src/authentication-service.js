(function () {
  class AuthenticationService {
    constructor(repository, sessionKey) { this.repository = repository; this.sessionKey = sessionKey; }
    getSession() { try { return JSON.parse(sessionStorage.getItem(this.sessionKey)); } catch (error) { return null; } }
    setSession(user) { sessionStorage.setItem(this.sessionKey, JSON.stringify({ email: user.email, name: user.name, role: user.role })); }
    clearSession() { sessionStorage.removeItem(this.sessionKey); }
    permissions(role, map) { return map[role] || []; }
    async verifyPassword(password, user, iterations = 150000) {
      const salt = Uint8Array.from(atob(user.passwordSalt), character => character.charCodeAt(0));
      const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
      const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256);
      const hash = btoa(String.fromCharCode(...new Uint8Array(bits)));
      return hash === user.passwordHash;
    }
  }
  window.AppAuthentication = { AuthenticationService };
})();
