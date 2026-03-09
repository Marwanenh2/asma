# 🎯 Notifications Push pour le site "Lettre à Asma"

Ce projet contient un petit système pour envoyer **des notifications push sur votre téléphone** lorsqu’une personne visite le site.

> ⚠️ Attention : pour que cela fonctionne sur iPhone (Safari), le site doit être servi en **HTTPS** et l’utilisateur doit avoir accepté les notifications.

---

## ✅ Ce qui est déjà en place

- `poeme.html` + `poeme.js` : enregistrement local des visites + inscription à un service push
- `sw.js` : service worker qui reçoit et affiche les notifications
- `server.js` : serveur Express qui stocke les abonnements et envoie les notifications

---

## 🚀 Ce que vous devez faire pour recevoir les notifications sur votre iPhone

### 1) Installer les dépendances
Dans le dossier du projet :

```bash
npm install
```

### 2) Générer des clés VAPID (obligatoire)

```bash
npx web-push generate-vapid-keys
```

Copiez les deux clés (`publicKey` et `privateKey`).

### 3) Lancer le serveur avec les clés

Sur macOS / Linux / WSL :

```bash
VAPID_PUBLIC_KEY=<votre_public> VAPID_PRIVATE_KEY=<votre_private> node server.js
```

Sur Windows PowerShell :

```powershell
$env:VAPID_PUBLIC_KEY='<votre_public>'
$env:VAPID_PRIVATE_KEY='<votre_private>'
node server.js
```

Le serveur démarrera sur `http://localhost:3000`.

---

## 📱 Ouvrir sur iPhone

1. Assurez-vous que le site est servi en **HTTPS** (ex: via un tunnel type `ngrok` ou une URL HTTPS réelle).
2. Ouvrez la page dans **Safari** (Safari est celui qui gère le mieux les notifications sur iOS).
3. Acceptez la permission de recevoir des notifications.

---

## 🔔 Comment les notifications sont envoyées

Chaque visite envoie une requête à `POST /visit`, et le serveur envoie une notification à tous les autres abonnés (sauf le visiteur actuel).

---

## ⚠️ Limites importantes

- **iPhone** : les notifications push web ne fonctionnent que sur Safari (les autres navigateurs iOS ne supportent pas encore correctement le push).
- **HTTPS requis** : sans HTTPS, Safari n’autorisera pas le service worker ni les notifications.
- **Serveur nécessaire** : il faut un serveur accessible publiquement (et pas seulement "file://") pour que votre iPhone puisse s’abonner.

---

💡 Si vous voulez, je peux vous aider à configurer un tunnel HTTPS (ngrok) ou à déployer sur un petit hébergeur pour que ça marche facilement depuis votre iPhone.
