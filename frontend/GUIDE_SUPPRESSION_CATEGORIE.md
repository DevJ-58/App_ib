# 🗑️ Guide : Suppression de Catégories

## 📋 Vue d'ensemble

L'utilisateur peut maintenant **supprimer une catégorie** en deux étapes :
1. **Ouvrir la modale** → Onglet "Gérer"
2. **Cliquer sur le bouton poubelle** pour supprimer

---

## 🎨 Interface de suppression

### **Avant de pouvoir supprimer**

Pour accéder à la gestion des catégories:

```
PRODUITS
┌─────────────────────────────┐
│ 🔽 FILTRES                  │
│                             │
│ Catégorie                   │
│ ┌────────────────────────┐  │
│ │ ajouter une categorie ◄── Cliquer ici
│ └────────────────────────┘  │
```

### **Modale s'ouvre**

```
    ┌──────────────────────────────────────┐
    │ ✕ Ajouter une Categorie              │
    ├──────────────────────────────────────┤
    │                                      │
    │  [➕ Ajouter]  [📋 Gérer] ◄ ONGLET   │
    │                                      │
    │  Onglet "Ajouter" par défaut...      │
    │                                      │
    └──────────────────────────────────────┘
```

### **Cliquer sur l'onglet "Gérer"**

```
    ┌──────────────────────────────────────┐
    │ ✕ Ajouter une Categorie              │
    ├──────────────────────────────────────┤
    │                                      │
    │  [➕ Ajouter]  [📋 Gérer] ◄ SÉLECTIONNÉ
    │                                      │
    │  📋 Liste des catégories             │
    │                                      │
    │  ┌────────────────────────────────┐ │
    │  │ Boissons      (3 produits)  [🗑️]│ │
    │  ├────────────────────────────────┤ │
    │  │ Snacks        (2 produits)  [🗑️]│ │
    │  ├────────────────────────────────┤ │
    │  │ Alimentaire   (5 produits)  [🗑️]│ │
    │  ├────────────────────────────────┤ │
    │  │ Hygiène       (1 produit)   [🗑️]│ │
    │  ├────────────────────────────────┤ │
    │  │ Électronique  (0 produit)   [🗑️]│ │ ← Peut être supprimée
    │  └────────────────────────────────┘ │
    │                                      │
    │           [Fermer]                   │
    │                                      │
    └──────────────────────────────────────┘
```

---

## 🔄 Processus de suppression

### **Cas 1: Catégorie SANS produit (Suppression possible)**

```
Utilisateur clique 🗑️ sur "Électronique" (0 produit)
         ↓
  ┌─────────────────────────────────────┐
  │ Êtes-vous sûr de vouloir supprimer  │
  │ la catégorie "Électronique" ?       │
  │                                     │
  │ [Annuler]  [Supprimer]             │
  └─────────────────────────────────────┘
         ↓ (Clic Supprimer)
  ┌─────────────────────────────┐
  │ ✓ Catégorie "Électronique"  │
  │   supprimée avec succès     │
  └─────────────────────────────┘
         ↓
  La catégorie disparaît de la liste
  Notification affichée (3-4 sec)
```

**Résultat:**
- ✅ Catégorie supprimée de `categoriesData`
- ✅ Sélects mis à jour (filtre, formulaire)
- ✅ Liste rafraîchie
- ✅ Notification de succès

---

### **Cas 2: Catégorie AVEC produits (Suppression impossible)**

```
Utilisateur clique 🗑️ sur "Boissons" (3 produits)
         ↓
  ┌──────────────────────────────────────┐
  │ ❌ Impossible de supprimer "Boissons": │
  │    3 produit(s) utilisent cette      │
  │    catégorie                         │
  └──────────────────────────────────────┘
         ↓
  Notification d'erreur affichée (3-4 sec)
  Onglet reste ouvert
  Utilisateur peut essayer autre chose
```

**Raison:** Éviter les données orphelines

---

### **Cas 3: Annuler la suppression**

```
Utilisateur clique 🗑️ sur une catégorie
         ↓
  Dialog confirmation apparaît
         ↓
  Utilisateur clique [Annuler]
         ↓
  Dialog ferme
  Rien n'est supprimé
  Liste inchangée
```

---

## 📊 Tableau des statuts

| Catégorie | Produits | Action | Résultat |
|-----------|----------|--------|----------|
| Électronique | 0 | Clic 🗑️ → Confirmer | ✅ Supprimée |
| Boissons | 3 | Clic 🗑️ | ❌ Erreur affichée |
| Hygiène | 1 | Clic 🗑️ → Confirmer | ❌ Erreur affichée |

---

## 🔧 Code JavaScript - Fonctions

### **1. Afficher la liste des catégories**

```javascript
function afficherListeCategories() {
    const listeContainer = document.getElementById('listeCategories');
    if (!listeContainer) return;

    let html = '<div class="categories-list">';
    
    if (categoriesData.length === 0) {
        html += '<p>Aucune catégorie</p>';
    } else {
        categoriesData.forEach((cat, index) => {
            // Compter les produits utilisant cette catégorie
            const nbProduits = produitsData.filter(
                p => p.categorie.toLowerCase() === cat.toLowerCase()
            ).length;
            
            // Créer item avec bouton supprimer
            html += `
                <div class="categorie-item">
                    <div class="categorie-info">
                        <span class="categorie-nom">${cat}</span>
                        <span class="categorie-count">
                            ${nbProduits} produit${nbProduits !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <button class="btn-supprimer-categorie" 
                            onclick="supprimerCategorie('${cat}')"
                            title="Supprimer">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
        });
    }
    
    html += '</div>';
    listeContainer.innerHTML = html;
}
```

### **2. Supprimer une catégorie**

```javascript
function supprimerCategorie(categorie) {
    // Vérifier si la catégorie est utilisée
    const produitsConcerned = produitsData.filter(
        p => p.categorie.toLowerCase() === categorie.toLowerCase()
    );
    
    // Si la catégorie est utilisée → Erreur
    if (produitsConcerned.length > 0) {
        afficherNotification(
            `Impossible de supprimer "${categorie}": 
             ${produitsConcerned.length} produit(s) utilise(nt) cette catégorie`,
            'error'
        );
        return;
    }

    // Demander confirmation
    const confirmation = confirm(
        `Êtes-vous sûr de vouloir supprimer la catégorie "${categorie}" ?`
    );
    
    if (!confirmation) {
        return; // Utilisateur a annulé
    }

    // Supprimer la catégorie
    const indexCategorie = categoriesData.findIndex(
        cat => cat.toLowerCase() === categorie.toLowerCase()
    );
    
    if (indexCategorie !== -1) {
        // Retirer de la liste
        categoriesData.splice(indexCategorie, 1);
        
        // Mettre à jour toutes les interfaces
        mettreAJourSelectCategories();
        
        // Afficher notification
        afficherNotification(
            `Catégorie "${categorie}" supprimée avec succès`,
            'success'
        );
    }
}
```

### **3. Basculer entre onglets**

```javascript
function basculerTabCategorie(tab) {
    const tabAjouter = document.getElementById('tabAjouter');
    const tabGerer = document.getElementById('tabGerer');
    const btnAjouter = document.querySelector('.categorie-tabs .tab-btn:first-child');
    const btnGerer = document.querySelector('.categorie-tabs .tab-btn:last-child');

    if (tab === 'ajouter') {
        // Afficher onglet Ajouter
        tabAjouter.classList.add('active');
        tabGerer.classList.remove('active');
        btnAjouter.classList.add('tab-active');
        btnGerer.classList.remove('tab-active');
        
    } else if (tab === 'gerer') {
        // Afficher onglet Gérer
        tabAjouter.classList.remove('active');
        tabGerer.classList.add('active');
        btnAjouter.classList.remove('tab-active');
        btnGerer.classList.add('tab-active');
        
        // Rafraîchir la liste des catégories
        afficherListeCategories();
    }
}
```

---

## 🎨 Éléments HTML

### **Nouveaux éléments ajoutés:**

```html
<!-- Onglets -->
<div class="categorie-tabs">
    <button class="tab-btn tab-active" onclick="basculerTabCategorie('ajouter')">
        <i class="fa-solid fa-plus"></i> Ajouter
    </button>
    <button class="tab-btn" onclick="basculerTabCategorie('gerer')">
        <i class="fa-solid fa-list"></i> Gérer
    </button>
</div>

<!-- Onglet Ajouter (original) -->
<div id="tabAjouter" class="categorie-tab-content active">
    <form id="formCategorie">
        <!-- ... formulaire ... -->
    </form>
</div>

<!-- Onglet Gérer (nouveau) -->
<div id="tabGerer" class="categorie-tab-content">
    <h3>📋 Liste des catégories</h3>
    <div id="listeCategories" class="liste-categories"></div>
</div>
```

---

## 🎨 CSS Styles

### **Onglets**
- Fond transparent avec border-bottom
- Couleur active: Primaire (#C41E3A)
- Transition lisse 0.2s

### **Liste des catégories**
- Items avec flex layout
- Icône 🗑️ à droite
- Compter des produits affichée
- Hover: fond gris clair

### **Bouton poubelle**
- Couleur: Rouge (#dc3545)
- Hover: Rouge foncé (#c82333)
- Active: Scale(0.95) feedback

---

## 🔒 Validation et sécurité

| Contrôle | Vérification |
|----------|-------------|
| **Catégorie utilisée** | `produitsData.filter()` compte produits |
| **Case-insensitive** | `.toLowerCase()` pour comparaison |
| **Confirmation dialog** | `confirm()` native du navigateur |
| **Double check** | `findIndex()` avant suppression |

---

## 📱 Responsive

- ✅ Desktop: Liste complète avec boutons
- ✅ Tablet: Layout ajusté
- ✅ Mobile: Même fonctionnalité

---

## 🧪 Scénarios de test

### **Test 1: Supprimer catégorie sans produit**
```
1. Ajouter une catégorie "Test"
2. Cliquer onglet "Gérer"
3. Voir "Test" dans la liste (0 produits)
4. Cliquer 🗑️
5. Confirmer suppression
6. Vérifier: ✓ Disparue ✓ Notification ✓ Selects mis à jour
```

### **Test 2: Essayer supprimer catégorie avec produit**
```
1. Aller à l'onglet "Gérer"
2. Voir "Boissons" (3 produits)
3. Cliquer 🗑️
4. Vérifier: ❌ Erreur affichée ✓ Liste inchangée
```

### **Test 3: Annuler suppression**
```
1. Aller à l'onglet "Gérer"
2. Cliquer 🗑️ sur une catégorie
3. Cliquer [Annuler] dans dialog
4. Vérifier: ✓ Rien supprimé ✓ Liste inchangée
```

---

## 📊 États possibles

| État | Description |
|------|-------------|
| **Avant suppression** | Catégorie visible dans liste avec count |
| **Dialog confirmation** | Modale native demande confirmation |
| **Erreur (utilisée)** | Notification rouge, liste inchangée |
| **Succès** | Notification verte, catégorie disparue |

---

## 🚀 Points clés

| Point | Détail |
|-------|--------|
| **Endroit** | Onglet "Gérer" de la modale |
| **Bouton** | Icône poubelle 🗑️ (rouge) |
| **Confirmation** | Dialog natif du navigateur |
| **Validation** | Vérif si catégorie utilisée |
| **Notification** | Erreur ou Succès |
| **Mise à jour** | Selects + liste rafraîchis |

---

## 💡 Améliorations futures possibles

1. **Fusion de catégories** - Transférer produits avant suppression
2. **Soft delete** - Archiver au lieu de supprimer
3. **Batch delete** - Supprimer plusieurs catégories
4. **Export** - Télécharger liste avant suppression
5. **Historique** - Log des suppressions

