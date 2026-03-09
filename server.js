const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname);
const LOGIN_FILE = path.join(ROOT, 'last-login.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};


function getLastLogin() {
  try {
    const raw = fs.readFileSync(LOGIN_FILE, 'utf8');
    const data = JSON.parse(raw);
    return data.lastLogin || null;
  } catch {
    return null;
  }
}

function setLastLogin({ date, ville, appareil }) {
  const data = { lastLogin: { date, ville, appareil } };
  fs.writeFileSync(LOGIN_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function sendJson(res, body, status = 200) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(json, 'utf8'),
    'Cache-Control': 'no-store',
  });
  res.end(json);
}

function serveStatic(req, res) {
  const parsed = url.parse(req.url);
  let pathname = decodeURIComponent(parsed.pathname);

  // server.js
  // Backend Express pour enregistrer et afficher la dernière connexion

  const express = require('express');
  const fs = require('fs');
  const path = require('path');
  const axios = require('axios');

  const app = express();
  const PORT = process.env.PORT || 3000;
  const DATA_FILE = path.join(__dirname, 'last-connection.json');

  app.use(express.static(__dirname)); // Sert les fichiers statiques (HTML, CSS, JS)
  app.use(express.json()); // Pour parser le JSON

  // Utilitaire pour détecter le type d'appareil à partir du user-agent
  function detectDevice(userAgent) {
    userAgent = userAgent || '';
    if (/iPhone/.test(userAgent)) return 'iPhone';
    if (/Android/.test(userAgent)) return 'Android';
    if (/Windows/.test(userAgent)) return 'PC Windows';
    if (/Macintosh|Mac OS/.test(userAgent)) return 'Mac';
    if (/Linux/.test(userAgent)) return 'Linux';
    // Le modèle exact n'est pas toujours détectable car le user-agent est souvent générique ou modifié par le navigateur.
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

      // Appel à une API de géolocalisation IP (ipapi.co)
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
