# Asma - Site Web

Ce dépôt contient un site web statique (HTML/CSS/JS) avec une **authentification simple** et une **horodatation globale de la dernière connexion** (partagée entre appareils) via un petit serveur Node.js.

## 🚀 Démarrer le serveur (Node.js requis)

1. **Installer Node.js**
   - Téléchargez et installez Node.js (version LTS) depuis : https://nodejs.org/
   - Vérifiez l'installation :
     ```bash
     node --version
     ```

2. **Lancer le serveur**
   - Ouvrez un terminal à la racine du projet (où se trouve `server.js`)
   - Exécutez :
     ```bash
     node server.js
     ```

3. **Ouvrir le site**
   - Allez sur : http://localhost:3000/

## 🔐 Identifiants de connexion

- **Nom d'utilisateur** : `Asma`
- **Mot de passe** : `0209`

## 🕒 Fonctionnalité "Dernière connexion" globale

- La première connexion stocke l'heure dans `last-login.json`.
- Les autres appareils lisent cette valeur partagée et l'affichent.

## 🧩 Structure des fichiers

- `index.html` – page de connexion
- `land.html` – page principale protégée
- `poeme.html` – page du poème protégée
- `login.js` – logique de connexion + anim
- `server.js` – serveur Node.js (API + fichiers statiques)
- `last-login.json` – stockage de la dernière connexion
