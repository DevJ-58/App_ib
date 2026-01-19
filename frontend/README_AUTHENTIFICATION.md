# 🔐 Système d'Authentification - Guide d'utilisation

## 📋 Résumé des modifications

Un système complet d'authentification avec stockage localStorage a été implémenté. Les utilisateurs peuvent maintenant:
- **S'inscrire** avec leurs données
- **Se connecter** avec leur téléphone et mot de passe
- **Accéder au dashboard** après authentification
- **Se déconnecter** proprement

---

## 🗝️ Comptes de démonstration

Les 3 comptes fictifs suivants sont disponibles dès le démarrage:

| Rôle | Téléphone | Mot de passe |
|------|-----------|-------------|
| Admin | 0123456789 | 123456 |
| Vendeur 1 | 0987654321 | password123 |
| Vendeur 2 | 0555555555 | password123 |

---

## 📁 Fichiers modifiés

### 1. **JS/main.js**
- ✅ Ajout de `initialiserAuthentification()` - Charge les données fictives en localStorage
- ✅ Ajout de `seConnecter()` - Gère la connexion des utilisateurs
- ✅ Ajout de `sInscrire()` - Gère l'inscription des nouveaux utilisateurs
- ✅ Ajout de `deconnecterUtilisateur()` - Supprime la session
- ✅ Ajout de `estAuthentifie()` - Vérifie si un utilisateur est connecté
- ✅ Ajout de `verifierAuthentification()` - Redirige vers connexion si nécessaire
- ✅ Modification du DOMContentLoaded - Initialise l'authentification
- ✅ Mise à jour de `deconnecter()` - Utilise les nouvelles fonctions

### 2. **HTML/connexion.html**
- ✅ Modification du formulaire (ajout d'IDs aux champs)
- ✅ Ajout d'un div pour afficher les messages d'erreur/succès
- ✅ Ajout d'un script pour:
  - Vérifier si déjà connecté (redirection vers dashboard)
  - Gérer la soumission du formulaire
  - Appeler `seConnecter()` et traiter le résultat
  - Rediriger vers le dashboard en cas de succès

### 3. **HTML/inscription.html**
- ✅ Modification du formulaire (ajout d'IDs aux champs)
- ✅ Suppression de l'action PHP (traitement client-side)
- ✅ Ajout d'un div pour afficher les messages d'erreur/succès
- ✅ Ajout d'un script pour:
  - Vérifier si déjà connecté (redirection vers dashboard)
  - Gérer la soumission du formulaire
  - Appeler `sInscrire()` et traiter le résultat
  - Rediriger vers le dashboard en cas de succès

### 4. **HTML/dashbord.html**
- ✅ Ajout d'un script pour:
  - Initialiser l'authentification
  - Vérifier que l'utilisateur est connecté
  - Afficher le nom de l'utilisateur connecté dans l'en-tête
  - Rediriger vers la page de connexion si non authentifié

### 5. **HTML/index.html** (NOUVEAU)
- ✅ Création d'une page d'accueil élégante
- ✅ Affichage des comptes de démonstration
- ✅ Redirection automatique vers le dashboard si déjà connecté

---

## 🔄 Flux d'utilisation

### Scenario 1: Nouvelle visite (Non inscrit)
1. Utilisateur va sur `index.html`
2. Clique sur "S'inscrire"
3. Remplit le formulaire d'inscription
4. Données sauvegardées en localStorage
5. Utilisateur connecté automatiquement
6. Redirection vers le dashboard ✅

### Scenario 2: Utilisateur existant (Test avec compte démo)
1. Utilisateur va sur `connexion.html`
2. Entre téléphone: `0123456789` et mot de passe: `123456`
3. Clique sur "Se connecter"
4. Session créée en localStorage
5. Redirection vers le dashboard ✅
6. Nom de l'utilisateur affiché dans l'en-tête

### Scenario 3: Déconnexion
1. Utilisateur clique sur "Déconnexion" dans le dashboard
2. Session supprimée de localStorage
3. Redirection vers la page de connexion ✅

---

## 💾 Stockage localStorage

### Structure `utilisateurs`
```json
[
  {
    "id": 1,
    "nom": "IB",
    "prenom": "Mr",
    "telephone": "0123456789",
    "email": "mr@uiya.com",
    "motDePasse": "123456",
    "role": "admin"
  }
]
```

### Structure `utilisateurConnecte`
```json
{
  "id": 1,
  "nom": "IB",
  "prenom": "Mr",
  "telephone": "0123456789",
  "email": "mr@uiya.com",
  "role": "admin"
}
```

---

## 🔒 Sécurité

⚠️ **Note**: Ce système utilise localStorage qui n'est pas sécurisé pour une application en production.
Pour une vraie application, il faudrait:
- Utiliser HTTPS
- Stocker les mots de passe hashés sur le serveur
- Utiliser des tokens JWT/sessions serveur
- Implémenter une vraie API backend

---

## ✅ Fonctionnalités implémentées

- ✅ Initialisation automatique des données fictives
- ✅ Validation des formulaires (client-side)
- ✅ Vérification de l'authentification
- ✅ Messages d'erreur/succès clairs
- ✅ Redirection automatique vers le dashboard
- ✅ Protection du dashboard (redirection si non authentifié)
- ✅ Affichage du nom de l'utilisateur
- ✅ Déconnexion propre
- ✅ Persistence de session

---

## 🚀 Test recommandé

1. Ouvrir `index.html` dans le navigateur
2. Cliquer sur "Se connecter"
3. Entrer les identifiants du compte admin: `0123456789` / `123456`
4. Vérifier l'affichage du dashboard avec le nom de l'utilisateur
5. Cliquer sur "Déconnexion"
6. Vérifier la redirection vers la connexion
7. Essayer de créer un nouveau compte en s'inscrivant

