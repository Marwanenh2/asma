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
        } else {
            gui.close()
        }
    }

    function generateFishTank() {
        clearTimeouts()
        tank.innerHTML = ""
        for (let i = 0; i < myoptions.NumFishGroups; i++) {
            let species = pick(myoptions.FishSpecies.split(" "))
            let numFish = 1
            if (!myoptions.SingleFishOnly && (Math.random() * 100) > (100 - myoptions.PercentSchools)) {
                numFish = getRandomInt(1, myoptions.MaxPerSchool)
            }
            let hueShift = myoptions.ColorChanging ? getRandomInt(0, 360) : 0

            let school = generateSchool(numFish, species, hueShift)
            tank.appendChild(school)
            loop(school)
        }
    }

    function generateSchool(numFish, species, hueShift) {
        //school position and area
        let root = document.createElement("div");
        root.setAttribute("class", "school")
        root.style.width = `${getRandomFloat(100, 1000)}px`
        root.style.height = `${getRandomFloat(100, 700)}px`
        root.style.left = `${getRandomFloat(0, 100)}%`
        root.style.top = `${getRandomFloat(0, 100)}%`

        //fish sizes
        let maxFishSize = WINDOW_MIN < MIN_THRESHOLD ? 50 : 80
        let minFishSize = WINDOW_MIN < MIN_THRESHOLD ? 5 : 10
        let staticSize = getRandomInt(minFishSize, maxFishSize / 2)
        let allSameSize = numFish > 1 && Math.random() > .7

        //size and color the fish and position them randomly in the school
        for (let i = 0; i < numFish; i++) {
            let fishPos = [getRandomFloat(0, 100), getRandomFloat(0, 100)]
            let size = allSameSize ? staticSize : getRandomInt(minFishSize, maxFishSize)
            let fish = generateFish(fishPos, hueShift, size, species)
            root.appendChild(fish);
        }
        return root
    }

    function loop(school) {

        let timeout = school.getAttribute('data-timeout')
        clearTimeout(timeout)
        let minInterval = myoptions.SwimSpeed == "Slow" ? 10000 : myoptions.SwimSpeed == "Moderate" ? 5000 : 3000
        let maxInterval = myoptions.SwimSpeed == "Slow" ? 30000 : myoptions.SwimSpeed == "Moderate" ? 20000 : 10000
        let nextCall = getRandomInt(minInterval, maxInterval)
        moveSchool(school, nextCall)
        timeout = setTimeout(loop.bind(this, school), nextCall)
        timeouts.push(timeout)
        school.setAttribute('data-timeout', timeout)
    }

    function moveSchool(school, nextCall) {

        //move the school as a whole
        let currentX = parseInt(school.getAttribute("data-x")) || 0
        let moveMoreVertically = isSquid(school.querySelector(".fish").textContent)
        let newX = moveMoreVertically ? getRandomFloat(-tank.clientWidth / 4, tank.clientWidth / 4) : getRandomFloat(-tank.clientWidth, tank.clientWidth)
        let newY = moveMoreVertically ? getRandomFloat(-tank.clientHeight, tank.clientHeight) : getRandomFloat(-tank.clientHeight / 4, tank.clientHeight / 4)

        const isRight = newX > currentX;
        let easing = Math.random() > .5 ? "ease" : "ease-in-out"
        school.style.transition = `transform ${nextCall}ms ${easing}`
        school.style.transform = `translate(${newX}px, ${newY}px)`
        school.setAttribute("data-x", newX)

        //correct fish direction if necessary and for >1 fish, shift them around a little in the school
        let maxTranslationDistance = WINDOW_MIN < MIN_THRESHOLD ? 50 : 100;;
        [...school.querySelectorAll(".fish")].forEach(fish => {

            let direction = fish.querySelector(".direction")
            direction.style.transform = `scaleX(${isRight ? -1 : 1})`
            direction.style.transition = `transform ${getRandomFloat(.2, .6)}s`
            if (school.children.length > 1) {

                let translateX = getRandomFloat(-maxTranslationDistance, maxTranslationDistance)
                let translateY = getRandomFloat(-maxTranslationDistance, maxTranslationDistance)
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

})("sweaverD.com")


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

// Ajouter le bouton de réinitialisation sur la page de connexion
if (document.getElementById('loginButton')) {
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Réinitialiser les connexions';
    resetBtn.className = 'button';
    resetBtn.style.marginTop = '10px';
    resetBtn.onclick = resetLastLogin;
    document.getElementById('loginButton').parentNode.appendChild(resetBtn);
}
