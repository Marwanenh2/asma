// Enregistre les visites dans le navigateur et affiche la dernière connexion.

const VISIT_STORAGE_KEY = "asma_poeme_visits";

window.addEventListener("DOMContentLoaded", () => {
    updateVisitInfo();
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

function formatDate(date) {
    return date.toLocaleString("fr-FR", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDuration(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes === 0) {
        return `${seconds} seconde${seconds > 1 ? "s" : ""}`;
    }
    return `${minutes} minute${minutes > 1 ? "s" : ""} ${seconds} seconde${seconds > 1 ? "s" : ""}`;
}
