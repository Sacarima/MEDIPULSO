// Broadcast session updates and logout across tabs.
// Falls back to localStorage events where BroadcastChannel is unavailable.

const CHANNEL_NAME = 'auth_channel';
const STORAGE_KEY = '__auth_broadcast__';

export function createSessionChannel(onMessage) {
  let bc = null;

  if ('BroadcastChannel' in window) {
    bc = new BroadcastChannel(CHANNEL_NAME);
    bc.onmessage = (ev) => onMessage(ev.data);
  } else {
    window.addEventListener('storage', (ev) => {
      if (ev.key !== STORAGE_KEY || !ev.newValue) return;
      try {
        const data = JSON.parse(ev.newValue);
        onMessage(data);
      } catch {}
    });
  }

  const post = (data) => {
    if (bc) {
      bc.postMessage(data);
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, t: Date.now() }));
        // Clean up quickly to avoid lingering
        setTimeout(() => localStorage.removeItem(STORAGE_KEY), 0);
      } catch {}
    }
  };

  const close = () => bc && bc.close();

  return { post, close };
}
