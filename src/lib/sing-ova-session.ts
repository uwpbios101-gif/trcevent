// One global "Sing Ova" identity shared across the /sing-ova hub and every
// /sing-ova-sundays/$city chapter page -- someone who verifies on either
// page is recognized on the other, since it's the same localStorage key
// and the same email-verified session underneath (sos_verifications /
// sos_members are global by design, not per-city).
export const SESSION_STORAGE_KEY = "sos_session";

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.email && parsed?.displayName) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
