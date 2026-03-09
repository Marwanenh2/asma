// main.js
// Frontend JS pour enregistrer et afficher la dernière connexion

// Appel à l'API pour enregistrer la connexion
async function trackConnection() {
    try {
        await fetch('/api/track-connection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
    } catch {
        // Gestion simple des erreurs
    }
}

// Récupère et affiche la dernière connexion
async function showLastConnection() {
    try {
        const res = await fetch('/api/last-connection');
        const data = await res.json();
        const conn = data.connection;
        const el = document.getElementById('last-connection-info');
        if (!conn) {
            el.textContent = 'Dernière connexion inconnue.';
            return;
        }
        // Formatage heure française
        const d = new Date(conn.date);
        const heure = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const ville = conn.city || 'ville inconnue';
        const appareil = conn.device || 'appareil inconnu';
        el.textContent = `Dernière connexion : ${appareil} à ${ville} à ${heure}`;
    } catch {
        document.getElementById('last-connection-info').textContent = 'Erreur récupération dernière connexion.';
    }
}

// Au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    trackConnection();
    showLastConnection();
});
