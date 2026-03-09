// Enregistre les visites dans le navigateur et affiche la dernière connexion.
// En option, permet de s'abonner aux notifications push (Safari/iOS/Android supporteront bientôt).

const VISIT_STORAGE_KEY = "asma_poeme_visits";
const CLIENT_ID_KEY = "asma_poeme_client_id";

window.addEventListener("DOMContentLoaded", () => {
    updateVisitInfo();
    initPushNotifications();
});

function updateVisitInfo() {
    const now = new Date();
    const visits = getVisits();

    // Ajoute la visite courante
    visits.push(now.toISOString());
    localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify(visits));

    const infoEl = document.getElementById("visitInfo");
    if (!infoEl) return;

    const visitCount = visits.length;
    const lastVisit = visits.length > 1 ? new Date(visits[visits.length - 2]) : null;

    if (!lastVisit || isNaN(lastVisit.getTime())) {
        infoEl.textContent = `Bienvenue ! Ceci est votre première visite.`;
        return;
    }

    const diff = now.getTime() - lastVisit.getTime();
    const diffText = formatDuration(diff);

    infoEl.textContent = `Dernière visite : ${formatDate(lastVisit)} (${diffText} depuis). Visites totales : ${visitCount}.`;
}

function getVisits() {
    try {
        const stored = localStorage.getItem(VISIT_STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
    } catch {
        // ignore malformed storage
    }
    return [];
}

function getClientId() {
    let clientId = localStorage.getItem(CLIENT_ID_KEY);
    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem(CLIENT_ID_KEY, clientId);
    }
    return clientId;
}

async function initPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('sw.js');
        await askNotificationPermission();

        const subscription = await getPushSubscription(registration);
        if (!subscription) return;

        const clientId = getClientId();
        await sendSubscriptionToServer(clientId, subscription);
        await notifyServerVisit(clientId);
    } catch (error) {
        // Les navigateurs peuvent bloquer les permissions, ou le service worker peut échouer
        console.warn('Push notifications non disponibles :', error);
    }
}

async function askNotificationPermission() {
    if (Notification.permission === 'default') {
        await Notification.requestPermission();
    }
    return Notification.permission === 'granted';
}

async function getPushSubscription(registration) {
    const existing = await registration.pushManager.getSubscription();
    if (existing) return existing;

    const response = await fetch('/vapidPublicKey');
    if (!response.ok) return null;

    const vapidPublicKey = await response.text();
    const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

    return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
    });
}

async function sendSubscriptionToServer(clientId, subscription) {
    await fetch('/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, subscription }),
    });
}

async function notifyServerVisit(clientId) {
    await fetch('/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function formatDate(date) {
    return date.toLocaleString('fr-FR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatDuration(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes === 0) {
        return `${seconds} seconde${seconds > 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds} seconde${seconds > 1 ? 's' : ''}`;
}
