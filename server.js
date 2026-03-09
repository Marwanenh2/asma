const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// --- VAPID keys (générez-les une fois via "npx web-push generate-vapid-keys")
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn('⚠️ VAPID_PUBLIC_KEY et/ou VAPID_PRIVATE_KEY non définis. Les notifications ne fonctionneront pas.');
}

webpush.setVapidDetails(
    'mailto:contact@example.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

// Stockage mémoire des abonnements (restart = perte)
const subscriptions = new Map();

app.get('/vapidPublicKey', (req, res) => {
    res.send(VAPID_PUBLIC_KEY);
});

app.post('/subscribe', (req, res) => {
    const { clientId, subscription } = req.body;
    if (!clientId || !subscription) {
        return res.status(400).send({ error: 'clientId et subscription requis' });
    }
    subscriptions.set(clientId, subscription);
    res.send({ success: true });
});

app.post('/visit', async (req, res) => {
    const { clientId } = req.body;
    if (!clientId) {
        return res.status(400).send({ error: 'clientId requis' });
    }

    const payload = JSON.stringify({
        title: 'Nouvelle visite',
        body: 'Quelqu’un vient de visiter votre site.',
        url: '/',
    });

    const promises = [];
    for (const [id, subscription] of subscriptions.entries()) {
        if (id === clientId) continue; // ne pas notifier l’utilisateur qui vient d’arriver
        promises.push(webpush.sendNotification(subscription, payload).catch((err) => {
            // Supprimer les abonnements qui ne sont plus valides
            if (err.statusCode === 404 || err.statusCode === 410) {
                subscriptions.delete(id);
            }
        }));
    }

    await Promise.all(promises);
    res.send({ success: true, notified: promises.length });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
