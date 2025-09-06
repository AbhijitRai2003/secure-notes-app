export function uuid() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  // fallback
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function now() {
  return new Date().toISOString();
}

export function normalize(s) {
  return (s || "").toLowerCase();
}
