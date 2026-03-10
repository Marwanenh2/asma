
// Identifiants corrects
const validUsername = 'Asma';
const validPassword = '0209';
const LAST_LOGIN_BASE = 'https://api.countapi.xyz';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        if (username === validUsername && password === validPassword) {
            localStorage.setItem('asma_logged_in', 'true');
            await updateLastLogin();
            window.location.href = './land.html';
        } else {
            errorDiv.textContent = 'Identifiants incorrects. Réessayez.';
        }
    });
    showLastLogin();
    // Bouton de réinitialisation
    const resetBtn = document.getElementById('resetLoginBtn');
    if (resetBtn) {
        resetBtn.onclick = async function () {
            await fetch(`${LAST_LOGIN_BASE}/set/asma-site/last-login?value=`);
            localStorage.removeItem('asma_last_login');
            alert('Dernière connexion réinitialisée.');
            showLastLogin();
        };
    }
});

// Met à jour la dernière connexion globale
async function updateLastLogin() {
    try {
        const now = new Date().toISOString();
        await fetch(`${LAST_LOGIN_BASE}/set/asma-site/last-login?value=${encodeURIComponent(now)}`);
        localStorage.setItem('asma_last_login', now);
    } catch { }
}

// Affiche la dernière connexion globale
async function showLastLogin() {
    try {
        const res = await fetch(`${LAST_LOGIN_BASE}/get/asma-site/last-login`);
        const data = await res.json();
        const last = data.value;
        if (last) {
            const el = document.getElementById('last-login');
            if (el) {
                const dt = new Date(last);
                el.textContent = `Dernière connexion globale : ${dt.toLocaleString()}`;
            }
        }
    } catch { }
}
