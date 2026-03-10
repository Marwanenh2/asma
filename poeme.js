document.addEventListener('DOMContentLoaded', function () {
    // Animation simple sur le texte du poème
    const poemeText = document.querySelector('.poeme-text');
    if (poemeText) {
        poemeText.style.opacity = 0;
        setTimeout(() => {
            poemeText.style.transition = 'opacity 1.5s';
            poemeText.style.opacity = 1;
        }, 300);
    }
});
(() => {
    const STORAGE_KEY = 'poemeVisitHistory';
    const MAX_ENTRIES = 20;

    function formatDateTime(date) {
        return date.toLocaleString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function updateVisitInfo() {
        const now = new Date();
        const raw = localStorage.getItem(STORAGE_KEY);
        let history = [];

        try {
            history = raw ? JSON.parse(raw) : [];
        } catch {
            history = [];
        }

        history.unshift(now.toISOString());
        history = history.slice(0, MAX_ENTRIES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

        const visitCount = history.length;
        const previousVisit = history[1] ? new Date(history[1]) : null;

        const visitInfoEl = document.querySelector('.visit-info');
        if (!visitInfoEl) return;

        let message = `Bienvenue ! C'est votre visite n°${visitCount}.`;
        if (previousVisit) {
            message += ` Dernière visite : ${formatDateTime(previousVisit)}.`;
        } else {
            message += ' C’est votre première visite ici.';
        }

        visitInfoEl.textContent = message;
    }

    document.addEventListener('DOMContentLoaded', updateVisitInfo);
})();
