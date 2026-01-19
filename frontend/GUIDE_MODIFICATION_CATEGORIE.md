# ✏️ Guide : Modification de Catégories

## 📋 Vue d'ensemble

L'utilisateur peut maintenant **modifier (renommer) une catégorie** directement depuis la liste en onglet "Gérer".

---

## 🎨 Interface de modification

### **Liste des catégories avec boutons**

```
    ┌────────────────────────────────────────────────────┐
    │ 📋 Liste des catégories                            │
    │                                                    │
    │ ┌──────────────────────────────────────────────┐  │
    │ │ Boissons      (3 produits)  [✏️] [🗑️]       │  │
    │ ├──────────────────────────────────────────────┤  │
    │ │ Snacks        (2 produits)  [✏️] [🗑️]       │  │
    │ ├──────────────────────────────────────────────┤  │
    │ │ Alimentaire   (5 produits)  [✏️] [🗑️]       │  │
    │ ├──────────────────────────────────────────────┤  │
    │ │ Hygiène       (1 produit)   [✏️] [🗑️]       │  │
    │ ├──────────────────────────────────────────────┤  │
    │ │ Électronique  (0 produits)  [✏️] [🗑️]       │  │
    │ └──────────────────────────────────────────────┘  │
    │                                                    │
    └────────────────────────────────────────────────────┘

    Boutons:
    [✏️] = Modifier   (Bleu)
    [🗑️] = Supprimer (Rouge)
```

---

## 🔄 Processus de modification

### **Étape 1: Cliquer sur le bouton "✏️ Modifier"**

```
Utilisateur clique sur [✏️] à côté de "Boissons"
         ↓
La ligne se transforme pour édition:
         ↓
    ┌──────────────────────────────────────────────────┐
    │ [  Boissons          ] [✓] [✕]                   │
    │ └──────────┬──────────┘  │    │                   │
    │            Input       Save Cancel                │
    │         avec FOCUS                                │
    └──────────────────────────────────────────────────┘
```

**État visuel:**
- Input apparaît avec le nom actuel
- Nom actuel sélectionné (ready to edit)
- Input reçoit le focus automatiquement
- Boutons originaux masqués
- Deux nouveaux boutons: ✓ (Sauvegarder) et ✕ (Annuler)

---

### **Étape 2: Modifier le nom**

```
Utilisateur efface "Boissons" et saisit "Boissons et Jus"
         ↓
    ┌──────────────────────────────────────────────────┐
    │ [  Boissons et Jus  ] [✓] [✕]                   │
    │                      Prêt à sauvegarder         │
    └──────────────────────────────────────────────────┘
```

**En temps réel:**
- Texte s'affiche dans l'input
- Peut supprimer/ajouter du texte
- Le formulaire est prêt à être sauvegardé

---

### **Étape 3a: Cliquer "✓ Sauvegarder"**

```
Utilisateur clique sur ✓ (Vert)
         ↓
Validation du nouveau nom:
  1️⃣  Non-vide? ✅ OK
  2️⃣  Pas identique au précédent? ✅ OK
  3️⃣  Pas un doublon? ✅ OK
         ↓
Modification acceptée:
  ✓ Nom changé dans categoriesData
  ✓ Tous les produits "Boissons" → "Boissons et Jus"
  ✓ Selects mis à jour
  ✓ Liste rafraîchie
         ↓
Notification affichée:
         ↓
    ┌────────────────────────────────────────────┐
    │  ✓ Catégorie "Boissons" renommée en       │
    │    "Boissons et Jus"                       │
    └────────────────────────────────────────────┘
       (Vert - Succès - 3-4 sec)
         ↓
Liste mise à jour:
         ↓
    ┌──────────────────────────────────────────────────┐
    │ [Boissons et Jus] (3 produits) [✏️] [🗑️]      │
    └──────────────────────────────────────────────────┘
```

---

### **Étape 3b: Cliquer "✕ Annuler"**

```
Utilisateur clique sur ✕ (Gris)
         ↓
Édition annulée:
  ✗ Rien n'est modifié
  ✗ Les données restent inchangées
  ✗ Pas de notification
         ↓
La ligne revient à son état normal:
         ↓
    ┌──────────────────────────────────────────────────┐
    │ Boissons      (3 produits)  [✏️] [🗑️]         │
    └──────────────────────────────────────────────────┘
```

---

## ⚠️ Cas d'erreur

### **Cas 1: Champ vide**

```
Utilisateur efface tout et clique ✓
         ↓
Notification erreur:
         ↓
    ┌────────────────────────────────┐
    │  ❌ Veuillez entrer un nom     │
    └────────────────────────────────┘
```

**Résultat:**
- ❌ Modification non sauvegardée
- ❌ Input reste visible
- ❌ L'utilisateur peut réessayer

---

### **Cas 2: Nom identique**

```
Utilisateur clique ✓ sans modifier le texte
         ↓
Système détecte: "Boissons" === "Boissons"
         ↓
Annulation automatique:
         ↓
La ligne revient à son état normal
Pas de notification
```

---

### **Cas 3: Catégorie en doublon**

```
Utilisateur change "Boissons" en "Snacks" (existe déjà)
         ↓
Validation échoue: Doublon détecté
         ↓
Notification erreur:
         ↓
    ┌────────────────────────────────┐
    │  ❌ Cette catégorie existe     │
    │     déjà                        │
    └────────────────────────────────┘
```

**Résultat:**
- ❌ Modification non sauvegardée
- ❌ Input reste avec "Snacks"
- ❌ L'utilisateur peut modifier

---

## 🔧 Code JavaScript - Fonctions

### **1. Démarrer la modification**

```javascript
function demarrerModificationCategorie(index, ancienNom) {
    const item = document.getElementById(`categorie-item-${index}`);
    const nomSpan = document.getElementById(`nom-categorie-${index}`);
    const actionsDiv = item.querySelector('.categorie-actions');
    
    // Créer l'interface d'édition
    let html = `
        <div class="categorie-modification">
            <input type="text" 
                   id="input-modif-${index}" 
                   class="input-modification" 
                   value="${ancienNom}">
            <div class="modification-actions">
                <button class="btn-action-mini btn-sauvegarder" 
                        onclick="sauvegarderModificationCategorie('${index}', '${ancienNom}')">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button class="btn-action-mini btn-annuler" 
                        onclick="annulerModificationCategorie('${index}')">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        </div>
    `;

    // Masquer le nom et les actions
    nomSpan.style.display = 'none';
    actionsDiv.style.display = 'none';
    
    // Insérer le formulaire de modification
    const modifDiv = document.createElement('div');
    modifDiv.innerHTML = html;
    modifDiv.id = `modif-div-${index}`;
    item.insertBefore(modifDiv.firstElementChild, actionsDiv);
    
    // Focus et sélection du texte
    const inputModif = document.getElementById(`input-modif-${index}`);
    inputModif.focus();
    inputModif.select();
}
```

### **2. Sauvegarder la modification**

```javascript
function sauvegarderModificationCategorie(index, ancienNom) {
    const inputModif = document.getElementById(`input-modif-${index}`);
    const nouveauNom = inputModif.value.trim();

    // Validation: non-vide
    if (!nouveauNom) {
        afficherNotification('Veuillez entrer un nom de catégorie', 'error');
        return;
    }

    // Validation: pas identique
    if (nouveauNom.toLowerCase() === ancienNom.toLowerCase()) {
        annulerModificationCategorie(index);
        return;
    }

    // Validation: pas doublon
    if (categoriesData.some(cat => 
        cat.toLowerCase() === nouveauNom.toLowerCase() && 
        cat.toLowerCase() !== ancienNom.toLowerCase())) {
        afficherNotification('Cette catégorie existe déjà', 'error');
        return;
    }

    // Trouver et mettre à jour
    const indexData = categoriesData.findIndex(
        cat => cat.toLowerCase() === ancienNom.toLowerCase()
    );
    
    if (indexData !== -1) {
        // 1. Mettre à jour les produits
        produitsData.forEach(produit => {
            if (produit.categorie.toLowerCase() === ancienNom.toLowerCase()) {
                produit.categorie = nouveauNom;
            }
        });

        // 2. Mettre à jour categoriesData
        categoriesData[indexData] = nouveauNom;

        // 3. Mettre à jour les selects
        mettreAJourSelectCategories();

        // 4. Notification
        afficherNotification(
            `Catégorie "${ancienNom}" renommée en "${nouveauNom}"`,
            'success'
        );

        // 5. Rafraîchir la liste
        afficherListeCategories();
    }
}
```

### **3. Annuler la modification**

```javascript
function annulerModificationCategorie(index) {
    const item = document.getElementById(`categorie-item-${index}`);
    const modifDiv = item.querySelector('.categorie-modification');
    const nomSpan = document.getElementById(`nom-categorie-${index}`);
    const actionsDiv = item.querySelector('.categorie-actions');

    // Supprimer le formulaire de modification
    if (modifDiv) {
        modifDiv.remove();
    }

    // Réafficher le nom et les actions
    nomSpan.style.display = '';
    actionsDiv.style.display = '';
}
```

---

## 🔄 Workflow complet

```
L'utilisateur clique [✏️]
       ↓
demarrerModificationCategorie()
       ↓
Convertit la ligne en formulaire d'édition
       ↓
Input reçoit FOCUS + sélectionne le texte
       ↓
Utilisateur saisit le nouveau nom
       ↓
Clic sur [✓] ou [✕]?
       ├─ [✓] → sauvegarderModificationCategorie()
       │        ├─ Validation (non-vide, doublon, identique)
       │        ├─ Si OK:
       │        │  ├─ Update categoriesData
       │        │  ├─ Update produits associés
       │        │  ├─ Update selects
       │        │  └─ Notification succès
       │        └─ Si erreur:
       │           └─ Notification erreur (input reste)
       │
       └─ [✕] → annulerModificationCategorie()
                ├─ Supprime formulaire
                ├─ Réaffiche nom et boutons
                └─ Pas de notification
```

---

## 📊 Tableau des opérations

| Opération | Avant | Après | Produits | Selects |
|-----------|-------|-------|----------|---------|
| Ajouter | N/A | Nouvelle | N/A | ✅ Mis à jour |
| Modifier | "Boissons" | "Boissons et Jus" | ✅ Renommés | ✅ Mis à jour |
| Supprimer | "Élec" | N/A | N/A (si 0) | ✅ Mis à jour |

---

## 🎨 Styles CSS

### **Bouton modifier**
- Couleur: Bleu (#007bff)
- Hover: Bleu foncé (#0056b3)
- Icon: ✏️

### **Input modification**
- Border: 2px solid rouge
- Focus: Shadow rouge clair
- Padding: 8px 12px

### **Boutons mini**
- Sauvegarder: Vert (#28a745)
- Annuler: Gris (#6c757d)
- Size: Plus petit que les autres boutons

---

## 🔒 Validations

| Validation | Détail |
|-----------|--------|
| **Non-vide** | `if (!nouveauNom)` |
| **Identité** | `.toLowerCase() === `.toLowerCase() |
| **Doublon** | `.some(cat => cat.toLowerCase() === nouveauNom)` |
| **Case-insensitive** | Toutes les comparaisons en minuscules |

---

## 📝 Mise à jour de données

**Quand une catégorie est modifiée:**

1. ✅ `categoriesData` - Le nom est changé
2. ✅ `produitsData` - Les produits sont renommés
3. ✅ Select filtre - Mis à jour
4. ✅ Select formulaire - Mis à jour
5. ✅ Liste affichée - Rafraîchie
6. ✅ UI - Revient à l'état normal

---

## 🚀 Points clés

| Point | Détail |
|-------|--------|
| **Localisation** | Onglet "Gérer" de la modale |
| **Bouton** | Icône stylo bleu [✏️] |
| **Interface** | Inline dans la liste |
| **Confirmation** | [✓] et [✕] boutons |
| **Auto-focus** | Input reçoit focus automatiquement |
| **Auto-select** | Texte sélectionné pour édition rapide |
| **Notification** | Succès/Erreur affichée |
| **Validation** | Multiple checks |

---

## 💡 Améliorations futures

1. **Keyboard shortcuts** - Entrer pour sauvegarder, Échap pour annuler
2. **Confirmation** - Dialog avant modification si produits associés
3. **Historique** - Log des changements
4. **Batch edit** - Éditer plusieurs à la fois
5. **Suggestive** - Suggestions de noms

