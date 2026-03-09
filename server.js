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
  if (pathname === '/') pathname = '/index.html';

  const fullPath = path.join(ROOT, pathname);
  if (!fullPath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(fullPath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname === '/api/last-login' && req.method === 'GET') {
    const last = getLastLogin();
    sendJson(res, { lastLogin: last });
    return;
  }

  if (parsed.pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { username, password, ville, appareil } = payload;
        const validUsername = 'Asma';
        const validPassword = '0209';
        if (username === validUsername && password === validPassword) {
          const previousLogin = getLastLogin();
          const now = new Date().toISOString();
          setLastLogin({ date: now, ville, appareil });
          sendJson(res, { success: true, lastLogin: previousLogin, currentLogin: { date: now, ville, appareil } });
        } else {
          sendJson(res, { success: false, message: 'Invalid username or password' }, 401);
        }
      } catch {
        sendJson(res, { success: false, message: 'Invalid request' }, 400);
      }
    });
    return;
  }

  // Fallback to serve static files
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
