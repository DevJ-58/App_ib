# Guide : Gestion des Catégories - Modale

## 📋 Vue d'ensemble

La modale d'ajout de catégorie permet d'ajouter dynamiquement de nouvelles catégories de produits. Ces catégories sont ensuite automatiquement disponibles dans:
- Le filtre de recherche des produits
- Le formulaire d'ajout de produits

---

## 🎨 Comment la modale apparaît

### **Ouverture de la modale**
```javascript
ouvrirModalCategorie()
```

1. **L'utilisateur clique** sur le bouton "Ajouter une catégorie"
2. **La modale s'affiche** avec une animation slide-down
3. **L'input est automatiquement focus** pour la saisie rapide

### **Visuellement:**
```
┌─────────────────────────────────────────────┐
│  × Ajouter une Categorie                   │
├─────────────────────────────────────────────┤
│                                             │
│  Nom de la categorie                       │
│  ┌───────────────────────────────────────┐ │
│  │[Veuillez entrer le nom]               │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌──────────────┐  ┌──────────────────┐   │
│  │   Annuler    │  │ ✓ Enregistrer   │   │
│  └──────────────┘  └──────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ✅ Processus d'ajout de catégorie

### **Étapes:**

1. **Utilisateur saisit** le nom de la catégorie
   ```
   Input: "Électronique"
   ```

2. **Validation:**
   - ✓ Le champ n'est pas vide
   - ✓ La catégorie n'existe pas déjà (case-insensitive)

3. **Si validation échouée:**
   ```javascript
   Notification d'erreur affichée:
   - "Veuillez entrer un nom de catégorie"
   - "Cette catégorie existe déjà"
   ```

4. **Si validation réussie:**
   - ✅ Catégorie ajoutée à `categoriesData`
   - ✅ Tous les selects mis à jour
   - ✅ Notification de succès affichée
   - ✅ Modale fermée
   - ✅ Formulaire réinitialisé

---

## 📊 Confirmation et affichage dans la liste

### **1. Notification de Confirmation**
```
┌─────────────────────────────────────────┐
│ ✓ Catégorie "Électronique" ajoutée      │
│   avec succès                           │
└─────────────────────────────────────────┘
```

**Type:** Success (Couleur verte)
**Durée:** 3-4 secondes

### **2. Mise à jour dynamique des listes**

#### **a) Filtre de catégories (Section Produits)**
```html
<select id="filtreCategorie">
  <option value="">Toutes les catégories</option>
  <option value="boissons">Boissons</option>
  <option value="snacks">Snacks</option>
  <option value="alimentaire">Alimentaire</option>
  <option value="hygiene">Hygiène</option>
  <option value="électronique">Électronique</option> ← NOUVEL
</select>
```

#### **b) Sélecteur de catégorie (Formulaire Produit)**
```html
<select id="categorieProduit">
  <option value="">Sélectionner une catégorie</option>
  <option value="boissons">Boissons</option>
  <option value="snacks">Snacks</option>
  <option value="alimentaire">Alimentaire</option>
  <option value="hygiene">Hygiène</option>
  <option value="électronique">Électronique</option> ← NOUVEL
</select>
```

---

## 🔄 Flux d'exécution complet

```
┌─────────────────────────────────────────────────┐
│  Utilisateur clique "Ajouter une catégorie"   │
└──────────────┬──────────────────────────────────┘
               ↓
    ┌──────────────────────────┐
    │ ouvrirModalCategorie()    │
    └──────────┬───────────────┘
               ↓
    ┌──────────────────────────┐
    │ Modale s'affiche         │
    │ (Classe: .active)        │
    └──────────┬───────────────┘
               ↓
    ┌──────────────────────────┐
    │ Utilisateur saisit nom   │
    │ ex: "Électronique"       │
    └──────────┬───────────────┘
               ↓
    ┌──────────────────────────┐
    │ Clic "Enregistrer"       │
    └──────────┬───────────────┘
               ↓
    ┌──────────────────────────┐
    │ Validation:              │
    │ - Pas vide?              │
    │ - Pas existe?            │
    └──────────┬───────────────┘
               ↓ (Si valide)
    ┌──────────────────────────┐
    │ ajouterCategorie()       │
    └──────────┬───────────────┘
               ↓
    ┌──────────────────────────┐
    │ Ajouter à categoriesData │
    └──────────┬───────────────┘
               ↓
    ┌──────────────────────────┐
    │ mettreAJourSelects()     │
    │ - Filtre produits        │
    │ - Formulaire produit     │
    └──────────┬───────────────┘
               ↓
    ┌──────────────────────────┐
    │ Notification SUCCESS     │
    │ "Catégorie ajoutée..."   │
    └──────────┬───────────────┘
               ↓
    ┌──────────────────────────┐
    │ fermerModalCategorie()   │
    └──────────┬───────────────┘
               ↓
    ┌──────────────────────────┐
    │ Modale fermée            │
    │ (Classe: .active retiré) │
    └──────────────────────────┘
```

---

## 🔧 Code JavaScript - Fonctions Principales

### **1. Ouvrir la modale**
```javascript
function ouvrirModalCategorie(mode = 'ajouter', categorieId = null) {
    const modalC = document.getElementById('modalCategorie');
    const formC = document.getElementById('formCategorie');
    const nomCategorieInput = document.getElementById('nomCategorie');

    if(!modalC) return;
    
    formC.reset();
    nomCategorieInput.focus();
    modalC.classList.add('active');
}
```

### **2. Fermer la modale**
```javascript
function fermerModalCategorie() {
    const modalC = document.getElementById('modalCategorie');
    if (modalC) {
        modalC.classList.remove('active');
    }
}
```

### **3. Ajouter une catégorie**
```javascript
function ajouterCategorie() {
    const nomCategorieInput = document.getElementById('nomCategorie');
    const nomCategorie = nomCategorieInput.value.trim();

    // Validation
    if (!nomCategorie) {
        afficherNotification('Veuillez entrer un nom de catégorie', 'error');
        return;
    }

    if (categoriesData.some(cat => cat.toLowerCase() === nomCategorie.toLowerCase())) {
        afficherNotification('Cette catégorie existe déjà', 'error');
        return;
    }

    // Ajouter
    categoriesData.push(nomCategorie);
    mettreAJourSelectCategories();
    afficherNotification(`Catégorie "${nomCategorie}" ajoutée avec succès`, 'success');
    fermerModalCategorie();
    document.getElementById('formCategorie').reset();
}
```

### **4. Mettre à jour les selects**
```javascript
function mettreAJourSelectCategories() {
    // Filtre catégorie
    const filtreCategorie = document.getElementById('filtreCategorie');
    if (filtreCategorie) {
        const selectedValue = filtreCategorie.value;
        filtreCategorie.innerHTML = '<option value="">Toutes les catégories</option>';
        
        categoriesData.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.toLowerCase();
            option.textContent = cat;
            filtreCategorie.appendChild(option);
        });
        
        if (selectedValue) {
            filtreCategorie.value = selectedValue;
        }
    }

    // Catégorie produit
    const categorieProduit = document.getElementById('categorieProduit');
    if (categorieProduit) {
        const selectedValue = categorieProduit.value;
        categorieProduit.innerHTML = '<option value="">Sélectionner une catégorie</option>';
        
        categoriesData.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.toLowerCase();
            option.textContent = cat;
            categorieProduit.appendChild(option);
        });
        
        if (selectedValue) {
            categorieProduit.value = selectedValue;
        }
    }
}
```

---

## 📋 Variables et structures

### **Stockage des catégories**
```javascript
let categoriesData = ['Boissons', 'Snacks', 'Alimentaire', 'Hygiène'];
```

**Type:** Array de strings
**Valeur initiale:** 4 catégories prédéfinies
**Persistance:** Mémoire JavaScript (se réinitialise au rechargement)

### **Éléments HTML associés**
```javascript
#modalCategorie           // Modale
#formCategorie           // Formulaire
#nomCategorie            // Input texte
#filtreCategorie         // Select filtre
#categorieProduit        // Select formulaire
```

---

## 🎯 Cas d'utilisation

### **Scénario 1: Ajout simple**
```
1. Utilisateur clique "Ajouter une catégorie"
2. Modale apparaît
3. Saisit "Électronique"
4. Clique "Enregistrer"
5. Catégorie ajoutée aux listes
6. Modale fermée
7. Notification affichée (3 sec)
```

### **Scénario 2: Catégorie en doublon**
```
1. Utilisateur clique "Ajouter une catégorie"
2. Modale apparaît
3. Saisit "Boissons" (existe déjà)
4. Clique "Enregistrer"
5. Erreur: "Cette catégorie existe déjà"
6. Modale reste ouverte
7. Utilisateur peut réessayer
```

### **Scénario 3: Fermeture sans sauvegarder**
```
Trois façons de fermer:
a) Clic "Annuler"
b) Clic sur X
c) Clic en dehors de la modale
→ Modale fermée sans effet
→ Donnée saisie perdue
```

---

## 🔒 Validation et sécurité

| Contrôle | Vérification |
|----------|-------------|
| **Non-vide** | `if (!nomCategorie)` |
| **Doublon** | `.some(cat => cat.toLowerCase() === nomCategorie.toLowerCase())` |
| **Trim** | `.trim()` supprime espaces début/fin |
| **Case-insensitive** | Comparaison en minuscules |

---

## 🎨 CSS - Classes utilisées

```css
.modal-overlay.active {
    opacity: 1;
    visibility: visible;
    /* La modale s'affiche avec transition */
}

.modal-container {
    animation: slideDown 0.3s ease;
    /* Animation d'apparition */
}
```

---

## 📱 Support responsive

- ✅ Desktop: Modale centrée à 600px max
- ✅ Tablet: Modale à 90% largeur
- ✅ Mobile: Modale pleine largeur

---

## 🚀 Améliorations futures possibles

1. **Persistance:** Sauvegarder en localStorage/API
2. **Édition:** Modifier une catégorie existante
3. **Suppression:** Supprimer une catégorie (avec vérification produits)
4. **Couleurs:** Assigner une couleur à chaque catégorie
5. **Tri:** Ordonner alphabétiquement les catégories
6. **Upload:** Ajouter une icône à chaque catégorie

