const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'last-connection.json');

app.use(express.static(__dirname)); // Sert les fichiers statiques (HTML, CSS, JS)
app.use(express.json()); // Pour parser le JSON

function detectDevice(userAgent) {
  userAgent = userAgent || '';
  if (/iPhone/.test(userAgent)) return 'iPhone';
  if (/Android/.test(userAgent)) return 'Android';
  if (/Windows/.test(userAgent)) return 'PC Windows';
  if (/Macintosh|Mac OS/.test(userAgent)) return 'Mac';
  if (/Linux/.test(userAgent)) return 'Linux';
  return 'appareil inconnu';
}

// Route POST pour enregistrer la connexion
app.post('/api/track-connection', async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const device = detectDevice(userAgent);
    const now = new Date();
    let city = 'ville inconnue';

    try {
      const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
      city = geoRes.data.city || geoRes.data.region || geoRes.data.country_name || 'ville inconnue';
    } catch {
      // Si l'API échoue, on garde "ville inconnue"
    }

    const connection = {
      date: now.toISOString(),
      city,
      device,
      ip
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(connection, null, 2), 'utf8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de l’enregistrement.' });
  }
});

// Route GET pour récupérer la dernière connexion
app.get('/api/last-connection', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.json({ connection: null });
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const connection = JSON.parse(raw);
    res.json({ connection });
  } catch {
    res.status(500).json({ connection: null });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
