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
        gui.closed ? gui.open() : gui.close()
    })


    /*Fish functions*/
    function initializeTank() {
        WINDOW_MIN = Math.min(tank.clientHeight, tank.clientWidth)
        generateFishTank()
        if (WINDOW_MIN <= MIN_THRESHOLD) {
            gui.close()

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
            fish.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
            let easing = Math.random() > .5 ? "ease" : "ease-in-out"
            fish.style.transition = `all ${nextCall}ms ${easing}`
        }
    })

}

    function generateFish(pos, hueShift, size, icon) {
    let htm = `<div class="direction">${icon}</div>`
    let f = document.createElement("div")
    f.setAttribute("class", "fish")
    f.style.filter = `hue-rotate(${hueShift}deg)`
    f.style.left = `${pos[0]}%`
    f.style.top = `${pos[1]}%`
    f.style.fontSize = `${size}px`
    f.innerHTML = htm
    return f
}

/*DAT.GUI表示*/
function Options() {

    this.Presets = "Ocean Mix"
    this.NumFishGroups = "20"
    this.SingleFishOnly = false;
    this.MaxPerSchool = "6";
    this.ColorChanging = true;
    this.PercentSchools = "25";
    this.SwimSpeed = "Moderate"
    this.FishSpecies = "👸 👸 👸 👸"
}

function generateControls() {
    myoptions = new Options();
    gui = new dat.GUI();
    gui.add(myoptions, "Presets", ["Ocean Mix", "Tropical Seas", "Schools", "Coral Reef", "Salmon Run", "Deep Water"]).onChange(setPreset);
    gui.add(myoptions, "NumFishGroups").listen().onChange(setValue)
    gui.add(myoptions, "SingleFishOnly").listen().onChange(setValue)
    gui.add(myoptions, "MaxPerSchool").listen().onChange(setValue)
    gui.add(myoptions, "PercentSchools").listen().onChange(setValue)
    gui.add(myoptions, "ColorChanging").listen().onChange(setValue)
    gui.add(myoptions, "SwimSpeed", ["Slow", "Moderate", "Fast"]).listen().onChange(setValue)
    gui.add(myoptions, "FishSpecies", fishes).listen().onChange(setValue);
}

function setValue() {
    generateFishTank()
}

function setPreset(value) {

    myoptions.SwimSpeed = "Moderate"
    switch (value) {
        case "Ocean Mix":
            myoptions.NumFishGroups = "20"
            myoptions.SingleFishOnly = false
            myoptions.MaxPerSchool = "7"
            myoptions.ColorChanging = true
            myoptions.PercentSchools = "25"
            myoptions.FishSpecies = "🐟 🐠 🐡"
            setGUI("FishSpecies", "🐟 🐠 🐡")
            setGUI("ColorChanging", true)
            setGUI("SingleFishOnly", false)
            break
        case "75 Lone Fish":
            myoptions.NumFishGroups = "75"
            myoptions.SingleFishOnly = true
            myoptions.ColorChanging = false
            myoptions.FishSpecies = "👸 👸 👸"
            setGUI("FishSpecies", " 👸 👸")
            setGUI("SingleFishOnly", true)
            setGUI("ColorChanging", false)
            break
        case "Tropical Seas":
            myoptions.NumFishGroups = "100"
            myoptions.SingleFishOnly = true
            myoptions.ColorChanging = true
            myoptions.SwimSpeed = "Slow"
            myoptions.FishSpecies = ""
            setGUI("FishSpecies", "")
            setGUI("SingleFishOnly", true)
            setGUI("ColorChanging", true)
            break
        case "Schools":
            myoptions.NumFishGroups = "10"
            myoptions.SingleFishOnly = false
            myoptions.MaxPerSchool = "10"
            myoptions.ColorChanging = false
            myoptions.PercentSchools = "100"
            myoptions.FishSpecies = "👸 👸 👸"
            setGUI("FishSpecies", "👸 👸 👸")
            setGUI("SingleFishOnly", false)
            setGUI("ColorChanging", false)
            break
        case "Coral Reef":
            myoptions.NumFishGroups = "100"
            myoptions.SingleFishOnly = false
            myoptions.MaxPerSchool = "24"
            myoptions.ColorChanging = true
            myoptions.PercentSchools = "25"
            myoptions.SwimSpeed = "Slow"
            myoptions.FishSpecies = "👸 👸 👸"
            setGUI("FishSpecies", "👸 👸 👸")
            setGUI("SingleFishOnly", false)
            setGUI("ColorChanging", true)
            break
        case "Salmon Run":
            myoptions.NumFishGroups = "100"
            myoptions.SingleFishOnly = true
            myoptions.ColorChanging = false
            myoptions.SwimSpeed = "Fast"
            myoptions.FishSpecies = ""
            setGUI("FishSpecies", "")
            setGUI("SingleFishOnly", true)
            setGUI("ColorChanging", false)
            break
        case "Deep Water":
            myoptions.NumFishGroups = "50"
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

// Shared store for the last login across devices (uses countapi.xyz)
const LAST_LOGIN_BASE = 'https://api.countapi.xyz';

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
        if (username === 'asma' && password === 'chateau') {
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
