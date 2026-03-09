/* Service Worker pour notifications Push */

self.addEventListener("push", (event) => {
    let data = { title: "Nouvelle visite", body: "Quelqu'un vient de visiter votre site.", url: "/" };

    try {
        const payload = event.data ? event.data.json() : null;
        if (payload) {
            data = { ...data, ...payload };
        }
    } catch (e) {
        // payload n'est pas JSON, on ignore
    }

    const options = {
        body: data.body,
        icon: "asma.jpg",
        badge: "asma.jpg",
        data: {
            url: data.url,
        },
        vibrate: [100, 50, 100],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url || "/";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === url && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
