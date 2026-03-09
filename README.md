# Asma - Site Web

Ce dépôt contient un site web statique (HTML/CSS/JS) avec une **authentification simple** et une **horodatation globale de la dernière connexion** (partagée entre appareils).

## 🚀 Ouvrir le site

1. Ouvre `index.html` dans un navigateur.
2. Si tu veux éviter des problèmes de CORS ou d'accès à des fichiers locaux, tu peux utiliser une extension comme **Live Server** (VS Code) ou démarrer un serveur simple (`python -m http.server` si Python est disponible).

## 🔐 Identifiants de connexion

- **Nom d'utilisateur** : `Asma`
- **Mot de passe** : `0209`

## 🕒 Fonctionnalité "Dernière connexion" globale

- La dernière connexion est partagée entre appareils via le service public `countapi.xyz`.
- Quand quelqu'un se connecte, l’heure est mise à jour pour tout le monde.

## 🧩 Structure des fichiers

- `index.html` – page de connexion
- `land.html` – page principale protégée
- `poeme.html` – page du poème protégée
- `login.js` – logique de connexion + mise à jour du temps de connexion
