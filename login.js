(function () {
    var myoptions, gui
    const fishes = ["✨ ✨ ✨ ✨", "🌙 🌙", "🦋 🦋", "🌟 🌟", "🧚 🧚 🧚"]
    var tank = document.getElementById("tank")
    var WINDOW_MIN
    const MIN_THRESHOLD = 650
    var timeouts = [];

    window.onload = () => {
        generateControls()
        initializeTank()
    }
    window.addEventListener("resize", () => {
        initializeTank()
    })
    tank.addEventListener("click", () => {

        document.addEventListener('DOMContentLoaded', function () {
            const form = document.getElementById('loginForm');
            const errorDiv = document.getElementById('loginError');
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value.trim();
                // Simple login: username = asma, password = chateau
                if (username === 'asma' && password === 'chateau') {
                    window.location.href = 'land.html';
                } else {
                    errorDiv.textContent = 'Identifiants incorrects. Réessayez.';
                }
            });
        });
        myoptions.SingleFishOnly = true
        myoptions.ColorChanging = false
        myoptions.FishSpecies = "👸 👸 👸 👸"
        setGUI("FishSpecies", "👸 👸 👸 👸")
        setGUI("SingleFishOnly", true)
        setGUI("ColorChanging", false)
        break
    }
    generateFishTank()
}
/*END GUI表示*/

/*HELPERS*/
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomFloat(min, max) {
    return (Math.random() * (max - min)) + min
}

function isMobile() {
    let mobile = window.matchMedia(`only screen and (max-width: ${MIN_THRESHOLD}px), only screen and (max-height:${MIN_THRESHOLD}px)`).matches;
    return mobile || navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Silk") != -1;
}

function clearTimeouts() {
    for (var i = 0; i < timeouts.length; i++) {
        window.clearTimeout(timeouts[i])
    }
    timeouts = []
}

function setGUI(name, val) {
    for (var i = 0; i < gui.__controllers.length; i++) {
        if (gui.__controllers[i].property == name)
            gui.__controllers[i].setValue(val);
    }
}

function isSquid(letter) {
    return /[\u{1f991}\u{1f419}]/u.test(letter)
}

}) ("sweaverD.com")


// Define the correct username and password
const validUsername = 'Asma';
const validPassword = '0209';
<<<<<<< HEAD

// Shared store for the last login across devices (uses countapi.xyz)
const LAST_LOGIN_BASE = 'https://api.countapi.xyz';

=======
// Function to check login credentials
function checkLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === validUsername && password === validPassword) {
        const payload = { username, password };
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(res => res.json())
            .then((response) => {
                if (response.success) {
                    localStorage.setItem('asma_logged_in', 'true');
                    const last = response.lastLogin || response.currentLogin;
                    if (last) {
                        localStorage.setItem('asma_last_login', last);
                    }
                    window.location.href = 'land.html';
                } else {
                    alert(response.message || 'Invalid username or password');
                }
            })
            .catch(() => {
                alert('Impossible de se connecter au serveur.');
            });
    } else {
        alert('Invalid username or password');
    }
}
>>>>>>> parent of 9a8ccff (derniere connexion)
// Add event listener to the login button
document.getElementById('loginButton').addEventListener('click', checkLogin);

// Réinitialiser la dernière connexion globale
function resetLastLogin() {
    fetch('https://api.countapi.xyz/set/asma-site/last-login?value=', { method: 'GET' })
        .then(() => {
            localStorage.removeItem('asma_last_login');
            alert('La dernière connexion a été réinitialisée sur tous les appareils.');
            // Optionnel : rafraîchir la page
            window.location.reload();
        })
        .catch(() => {
            alert('Erreur lors de la réinitialisation.');
        });
}


// --- Ajout de la gestion de la dernière connexion ---
async function getVille() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        return data.city || data.region || data.country_name || 'Inconnu';
    } catch {
        return 'Inconnu';
    }
}

function getAppareil() {
    const ua = navigator.userAgent;
    // Simple extraction, améliorable
    if (/iPhone/.test(ua)) {
        const match = ua.match(/iPhone OS ([\d_]+)/);
        return match ? `iPhone (${match[1].replace('_', '.')})` : 'iPhone';
    }
    if (/Android/.test(ua)) {
        const match = ua.match(/Android ([\d.]+)/);
        return match ? `Android (${match[1]})` : 'Android';
    }
    if (/Windows/.test(ua)) return 'Windows';
    if (/Macintosh/.test(ua)) return 'Mac';
    return ua.split(')')[0] + ')';
}

async function loginWithDeviceInfo(username, password) {
    const ville = await getVille();
    const appareil = getAppareil();
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, ville, appareil })
    });
    return res.json();
}

// Remplacer l'ancien handler de connexion si existant
const loginBtn = document.getElementById('loginButton');
if (loginBtn) {
    loginBtn.onclick = async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const result = await loginWithDeviceInfo(username, password);
        if (result.success) {
            localStorage.setItem('asma_logged_in', 'true');
            window.location.href = 'land.html';
        } else {
            alert(result.message || 'Erreur de connexion');
        }
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        // Simple login: username = asma, password = chateau
        if (username === 'asma' && password === '0209') {
            window.location.href = 'land.html';
        } else {
            errorDiv.textContent = 'Identifiants incorrects. Réessayez.';
        }
    });
});

// Ajouter le bouton de réinitialisation sur la page de connexion
if (document.getElementById('loginButton')) {
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Réinitialiser les connexions';
    resetBtn.className = 'button';
    resetBtn.style.marginTop = '10px';
    resetBtn.onclick = resetLastLogin;
    document.getElementById('loginButton').parentNode.appendChild(resetBtn);
}
