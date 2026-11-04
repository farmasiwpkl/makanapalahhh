// Service worker: shows push notifications (even when the phone is locked) and opens the app when tapped.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("push", e => {
  let j = {};
  try { j = e.data.json(); } catch (_) {}
  const d = j.data || j.notification || {};
  const title = d.title || "🍜 Makan apa-lahhh!";
  const body = d.body || "There’s a new group order.";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      // If the app is open on screen, the page already shows its own alert.
      if (list.some(c => c.visibilityState === "visible")) return;
      return self.registration.showNotification(title, { body, tag: "group-order", renotify: true, data: { url: d.url || "./" } });
    })
  );
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window" }).then(l => l.length ? l[0].focus() : self.clients.openWindow("./")));
});
