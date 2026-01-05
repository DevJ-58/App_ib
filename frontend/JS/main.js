// ====================================================================
// SYSTÈME DE GESTION DE STOCK BOUTIQUE UIYA - MAIN.JS
// ====================================================================
function Opendash(){
    window.location.href = "dashbord.html";
}
// ====================================================================
// VARIABLES GLOBALES
// ====================================================================

let utilisateurConnecte = {
    id: 1,
    nom: "Mr IB",
    role: "admin"
};

let panier = [];
let produitsData = [];
let stockData = [];
let creditData = [];
let ventesData = [];
let mouvementsData = [];
let alertesData = [];

// ====================================================================
// INITIALISATION AU CHARGEMENT
// ====================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du système...');
    
    // Charger les données initiales
    chargerDonneesInitiales();
    
    // Initialiser les événements
    initialiserEvenements();
    
    // Afficher la section dashboard par défaut
    afficherSection('dashboard');
    
    // Mettre à jour les statistiques
    mettreAJourStatistiques();
    
    console.log('✅ Système initialisé avec succès');
});

// ====================================================================
// CHARGEMENT DES DONNÉES
// ====================================================================

function chargerDonneesInitiales() {
    // Dans la version finale, ces données viendront du backend PHP via AJAX
    
    // Charger les produits
    produitsData = [
        {
            id: 'COCA001',
            nom: 'Coca-Cola 50cl',
            codeBarre: '5449000000996',
            categorie: 'boissons',
            prix: 500,
            stock: 5,
            seuilAlerte: 10,
            icone: 'fa-bottle-water'
        },
        {
            id: 'PAIN001',
            nom: 'Pain',
            codeBarre: '2345678901234',
            categorie: 'alimentaire',
            prix: 200,
            stock: 8,
            seuilAlerte: 15,
            icone: 'fa-bread-slice'
        },
        {
            id: 'EAU001',
            nom: 'Eau minérale 1.5L',
            codeBarre: '3456789012345',
            categorie: 'boissons',
            prix: 300,
            stock: 45,
            seuilAlerte: 20,
            icone: 'fa-wine-bottle'
        },
        {
            id: 'CAFE001',
            nom: 'Café Nescafé',
            codeBarre: '8901234567890',
            categorie: 'alimentaire',
            prix: 2500,
            stock: 3,
            seuilAlerte: 5,
            icone: 'fa-mug-hot'
        },
        {
            id: 'BISCUIT001',
            nom: 'Biscuits Golden',
            codeBarre: '4567890123456',
            categorie: 'snacks',
            prix: 350,
            stock: 32,
            seuilAlerte: 15,
            icone: 'fa-cookie'
        }
    ];
    
    // Charger les stocks
    stockData = JSON.parse(JSON.stringify(produitsData)); // Copie des produits
    
    // Charger les crédits
    creditData = [
        {
            id: 'C-001',
            client: 'Koné Abou',
            montantInitial: 15000,
            montantRestant: 12000,
            dateCredit: '05/12/2025',
            joursEcoules: 9,
            etat: 'retard'
        },
        {
            id: 'C-002',
            client: 'Personnel UIYA',
            montantInitial: 6200,
            montantRestant: 6200,
            dateCredit: '14/12/2025',
            joursEcoules: 0,
            etat: 'en-cours'
        }
    ];
    
    // Charger les mouvements
    mouvementsData = [
        {
            id: 1,
            type: 'entree',
            produitId: 'RIZ001',
            produitNom: 'Riz 25kg',
            quantite: 20,
            motif: 'Approvisionnement',
            date: '14/12/2025 10:30'
        },
        {
            id: 2,
            type: 'sortie',
            produitId: 'COCA001',
            produitNom: 'Coca-Cola 50cl',
            quantite: 15,
            motif: 'Vente',
            date: '14/12/2025 09:15'
        }
    ];
    
    console.log('📦 Données chargées:', {
        produits: produitsData.length,
        credits: creditData.length,
        mouvements: mouvementsData.length
    });
}

// ====================================================================
// GESTION DE LA NAVIGATION
// ====================================================================

function afficherSection(nomSection) {
    console.log('📄 Navigation vers:', nomSection);
    
    // Masquer toutes les sections
    const sections = document.querySelectorAll('.section-page');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Afficher la section demandée
    const sectionCible = document.getElementById('section-' + nomSection);
    if (sectionCible) {
        sectionCible.classList.add('active');
        sectionCible.style.display = 'block';
    }
    
    // Mettre à jour le menu actif
    const liens = document.querySelectorAll('.menu-navigation a');
    liens.forEach(lien => {
        lien.classList.remove('actif');
    });
    
    // Charger les données spécifiques à la section
    switch(nomSection) {
        case 'dashboard':
            chargerDashboard();
            break;
        case 'produits':
            chargerProduits();
            break;
        case 'ventes':
            chargerVentes();
            break;
        case 'stocks':
            chargerStocks();
            break;
        case 'credits':
            chargerCredits();
            break;
        case 'inventaires':
            chargerInventaires();
            break;
        case 'rapports':
            chargerRapports();
            break;
        case 'alertes':
            chargerAlertes();
            break;
    }
}

function toggleMenu() {
    const barreLaterale = document.getElementById('barreLaterale');
    if (barreLaterale) {
        barreLaterale.classList.toggle('active');
    }
}

// ====================================================================
// GESTION DU DASHBOARD
// ====================================================================

function chargerDashboard() {
    console.log('📊 Chargement du dashboard');
    mettreAJourStatistiques();
}

function initialiserChartDashboard() {
    const canvas = document.getElementById('chartVentes7Jours');
    if (!canvas) return;

    // Exemple de données pour 7 derniers jours (remplacer par données réelles côté backend)
    const labels = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
    }

    // Si vous avez des données réelles, utilisez `ventesData` ou une autre source
    const ventesSimulees = [120000, 95000, 110000, 125000, 98000, 140000, 130000];

    // Détruire le graphique précédent si présent
    if (window._chartVentes7Jours) {
        try { window._chartVentes7Jours.destroy(); } catch (e) { /* ignore */ }
    }

    // Adapter la taille du conteneur pour un rendu correct
    const parent = canvas.parentElement;
    if (parent) parent.style.height = '320px';

    window._chartVentes7Jours = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventes (FCFA)',
                data: ventesSimulees,
                backgroundColor: 'rgba(54,162,235,0.2)',
                borderColor: 'rgba(54,162,235,1)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}

function mettreAJourStatistiques() {
    // Calculer les statistiques
    let ventesJour = 125000;
    let produitsVendus = 48;
    let valeurStock = 0;
    let creditsEnCours = 75000;
    
    produitsData.forEach(p => {
        valeurStock += p.stock * p.prix;
    });
    
    // Mettre à jour l'affichage (les éléments dans toutes les sections)
    const elemsValeurStock = document.querySelectorAll('[id*="valeurStock"], .carte-stat.stock p');
    elemsValeurStock.forEach(elem => {
        if (elem.tagName === 'P') {
            elem.textContent = valeurStock.toLocaleString() + ' FCFA';
        }
    });
}

function telechargerRapportJournalier() {
    alert('Téléchargement du rapport journalier en cours...\nFonctionnalité à implémenter avec le backend PHP');
    // Dans la version finale: window.location.href = 'backend/rapports/journalier.php';
}

// ====================================================================
// GESTION DES PRODUITS
// ====================================================================

function chargerProduits() {
    console.log('📦 Chargement des produits');
    afficherProduits(produitsData);
}

function afficherProduits(produits) {
    const tbody = document.getElementById('corpTableauProduits');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    produits.forEach(produit => {
        const etat = determinerEtatStock(produit.stock, produit.seuilAlerte);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="info-produit">
                    <div class="icone-produit">
                        <i class="fa-solid ${produit.icone}"></i>
                    </div>
                    <div class="details-produit">
                        <h4>${produit.nom}</h4>
                        <span class="code-barre">${produit.codeBarre}</span>
                    </div>
                </div>
            </td>
            <td><span class="badge-categorie badge-${produit.categorie}">${produit.categorie}</span></td>
            <td><span class="prix-produit">${produit.prix.toLocaleString()} FCFA</span></td>
            <td>
                <div class="stock-produit">
                    <span class="badge-stock stock-${etat.classe}">${produit.stock} unités</span>
                </div>
            </td>
            <td>${produit.seuilAlerte}</td>
            <td>
                <div class="actions-produit">
                    <button class="btn-icone btn-voir" title="Voir détails" onclick="voirDetailProduit('${produit.id}')">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn-icone btn-modifier" title="Modifier" onclick="modifierProduit('${produit.id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icone btn-supprimer" title="Supprimer" onclick="confirmerSuppressionProduit('${produit.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

function ouvrirModalProduit(mode = 'ajouter', produitId = null) {
    const modal = document.getElementById('modalProduit');
    const titre = document.getElementById('titreProduit');
    const form = document.getElementById('formProduit');
    
    if (!modal) return;
    
    form.reset();
    
    if (mode === 'modifier' && produitId) {
        const produit = produitsData.find(p => p.id === produitId);
        if (produit) {
            titre.innerHTML = '<i class="fa-solid fa-pen"></i> Modifier le Produit';
            document.getElementById('nomProduit').value = produit.nom;
            document.getElementById('codeBarreProduit').value = produit.codeBarre;
            document.getElementById('categorieProduit').value = produit.categorie;
            document.getElementById('prixProduit').value = produit.prix;
            document.getElementById('stockInitial').value = produit.stock;
            document.getElementById('seuilAlerte').value = produit.seuilAlerte;
        }
    } else {
        titre.innerHTML = '<i class="fa-solid fa-plus"></i> Ajouter un Produit';
    }
    
    modal.classList.add('active');
}

function fermerModalProduit() {
    const modal = document.getElementById('modalProduit');
    if (modal) {
        modal.classList.remove('active');
    }
}

function modifierProduit(produitId) {
    ouvrirModalProduit('modifier', produitId);
}

function confirmerSuppressionProduit(produitId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        supprimerProduit(produitId);
    }
}

function supprimerProduit(produitId) {
    produitsData = produitsData.filter(p => p.id !== produitId);
    afficherProduits(produitsData);
    afficherNotification('Produit supprimé avec succès', 'success');
}

function voirDetailProduit(produitId) {
    const produit = produitsData.find(p => p.id === produitId);
    if (produit) {
        alert(`Détails du produit:\n\nNom: ${produit.nom}\nCode-barre: ${produit.codeBarre}\nPrix: ${produit.prix} FCFA\nStock: ${produit.stock} unités`);
    }
}

function filtrerProduits() {
    const categorie = document.getElementById('filtreCategorie')?.value;
    const etatStock = document.getElementById('filtreStock')?.value;
    
    let resultats = produitsData;
    
    if (categorie) {
        resultats = resultats.filter(p => p.categorie === categorie);
    }
    
    if (etatStock) {
        resultats = resultats.filter(p => {
            const etat = determinerEtatStock(p.stock, p.seuilAlerte);
            return etat.classe === etatStock;
        });
    }
    
    afficherProduits(resultats);
}

function trierProduits() {
    const tri = document.getElementById('triProduits')?.value;
    let resultats = [...produitsData];
    
    switch(tri) {
        case 'nom':
            resultats.sort((a, b) => a.nom.localeCompare(b.nom));
            break;
        case 'nom-desc':
            resultats.sort((a, b) => b.nom.localeCompare(a.nom));
            break;
        case 'prix':
            resultats.sort((a, b) => a.prix - b.prix);
            break;
        case 'prix-desc':
            resultats.sort((a, b) => b.prix - a.prix);
            break;
        case 'stock':
            resultats.sort((a, b) => a.stock - b.stock);
            break;
        case 'stock-desc':
            resultats.sort((a, b) => b.stock - a.stock);
            break;
    }
    
    afficherProduits(resultats);
}

function scannerCodeBarre() {
    alert('Scanner de code-barre activé\nFonctionnalité à implémenter avec un lecteur USB');
    // Simulation d'un scan
    setTimeout(() => {
        document.getElementById('codeBarreProduit').value = '12345' + Math.floor(Math.random() * 100000);
    }, 1000);
}

// ====================================================================
// GESTION DES VENTES
// ====================================================================

function chargerVentes() {
    console.log('🛒 Chargement des ventes');
    chargerProduitsPopulaires();
}

function chargerProduitsPopulaires() {
    const container = document.getElementById('produitsRapides');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Afficher les 6 premiers produits
    produitsData.slice(0, 6).forEach(produit => {
        const carte = document.createElement('div');
        carte.className = 'produit-rapide';
        carte.innerHTML = `
            <i class="fa-solid ${produit.icone}"></i>
            <h5>${produit.nom}</h5>
            <p>${produit.prix} FCFA</p>
        `;
        carte.onclick = () => ajouterAuPanier(produit.id);
        container.appendChild(carte);
    });
}

function ajouterAuPanier(produitId) {
    const produit = produitsData.find(p => p.id === produitId);
    if (!produit) return;
    
    if (produit.stock <= 0) {
        afficherNotification('Stock insuffisant', 'error');
        return;
    }
    
    const itemPanier = panier.find(item => item.id === produitId);
    
    if (itemPanier) {
        itemPanier.quantite++;
    } else {
        panier.push({
            id: produit.id,
            nom: produit.nom,
            prix: produit.prix,
            quantite: 1
        });
    }
    
    afficherPanier();
}

function afficherPanier() {
    const container = document.getElementById('listePanier');
    const nombreArticles = document.getElementById('nombreArticlesPanier');
    const totalElem = document.getElementById('total');
    const btnValider = document.getElementById('btnValider');
    
    if (!container) return;
    
    if (panier.length === 0) {
        container.innerHTML = `
            <div class="panier-vide">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Aucun produit dans le panier</p>
            </div>
        `;
        nombreArticles.textContent = '0';
        totalElem.textContent = '0 FCFA';
        btnValider.disabled = true;
        return;
    }
    
    container.innerHTML = '';
    let total = 0;
    
    panier.forEach((item, index) => {
        const sousTotal = item.prix * item.quantite;
        total += sousTotal;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-panier';
        itemDiv.innerHTML = `
            <div class="item-info">
                <h5>${item.nom}</h5>
                <p>${item.prix.toLocaleString()} FCFA × ${item.quantite}</p>
            </div>
            <div class="item-actions">
                <button onclick="modifierQuantitePanier(${index}, -1)">-</button>
                <span>${item.quantite}</span>
                <button onclick="modifierQuantitePanier(${index}, 1)">+</button>
                <button class="btn-suppr" onclick="retirerDuPanier(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="item-total">${sousTotal.toLocaleString()} FCFA</div>
        `;
        
        container.appendChild(itemDiv);
    });
    
    nombreArticles.textContent = panier.length;
    totalElem.textContent = total.toLocaleString() + ' FCFA';
    btnValider.disabled = false;
}

function modifierQuantitePanier(index, delta) {
    if (panier[index]) {
        panier[index].quantite += delta;
        
        if (panier[index].quantite <= 0) {
            panier.splice(index, 1);
        }
        
        afficherPanier();
    }
}

function retirerDuPanier(index) {
    panier.splice(index, 1);
    afficherPanier();
}

function selectionnerPaiement(type) {
    const champClient = document.getElementById('champClient');
    const zoneMontant = document.getElementById('zoneMontantRecu');
    const options = document.querySelectorAll('.option-paiement');
    
    options.forEach(opt => opt.classList.remove('actif'));
    event.target.closest('.option-paiement').classList.add('actif');
    
    if (type === 'credit') {
        champClient.style.display = 'block';
        zoneMontant.style.display = 'none';
    } else {
        champClient.style.display = 'none';
        zoneMontant.style.display = 'block';
    }
}

function annulerVente() {
    if (panier.length > 0) {
        if (confirm('Voulez-vous vraiment annuler cette vente ?')) {
            panier = [];
            afficherPanier();
            document.getElementById('nomClient').value = '';
            document.getElementById('montantRecu').value = '';
            afficherNotification('Vente annulée', 'info');
        }
    }
}

function validerVente() {
    if (panier.length === 0) {
        afficherNotification('Le panier est vide', 'error');
        return;
    }
    
    const typePaiement = document.querySelector('.option-paiement.actif .label-paiement').textContent;
    
    if (typePaiement === 'À crédit') {
        const nomClient = document.getElementById('nomClient').value;
        if (!nomClient) {
            afficherNotification('Veuillez saisir le nom du client', 'error');
            return;
        }
    }
    
    // Calculer le total
    let total = 0;
    panier.forEach(item => {
        total += item.prix * item.quantite;
    });
    
    // Créer la vente
    const vente = {
        id: 'V-' + (Date.now() % 10000).toString().padStart(3, '0'),
        produits: [...panier],
        total: total,
        type: typePaiement,
        date: new Date().toLocaleString('fr-FR'),
        client: document.getElementById('nomClient').value || 'Client'
    };
    
    // Mettre à jour les stocks
    panier.forEach(item => {
        const produit = produitsData.find(p => p.id === item.id);
        if (produit) {
            produit.stock -= item.quantite;
        }
    });
    
    // Afficher le ticket
    afficherTicket(vente);
    
    // Réinitialiser le panier
    panier = [];
    afficherPanier();
    
    console.log('✅ Vente validée:', vente);
}

function afficherTicket(vente) {
    const modal = document.getElementById('modalTicket');
    const numeroTicket = document.getElementById('numeroTicket');
    const dateTicket = document.getElementById('dateTicket');
    const itemsTicket = document.getElementById('itemsTicket');
    const totalTicket = document.getElementById('totalTicket');
    const infosPaiement = document.getElementById('infosPaiement');
    
    if (!modal) return;
    
    numeroTicket.textContent = vente.id;
    dateTicket.textContent = vente.date;
    totalTicket.textContent = vente.total.toLocaleString() + ' FCFA';
    infosPaiement.textContent = `Type: ${vente.type} - Client: ${vente.client}`;
    
    itemsTicket.innerHTML = '';
    vente.produits.forEach(item => {
        const ligne = document.createElement('div');
        ligne.className = 'ticket-item';
        ligne.innerHTML = `
            <span>${item.nom} x${item.quantite}</span>
            <span>${(item.prix * item.quantite).toLocaleString()} FCFA</span>
        `;
        itemsTicket.appendChild(ligne);
    });
    
    modal.classList.add('active');
}

function imprimerTicket() {
    window.print();
}

function fermerTicket() {
    const modal = document.getElementById('modalTicket');
    if (modal) {
        modal.classList.remove('active');
    }
}

function voirDetailVente(venteId) {
    alert(`Détails de la vente ${venteId}\nFonctionnalité à implémenter`);
    // Ouvrir modal avec les détails
}

function activerScanner() {
    alert('Scanner de code-barre activé\nFonctionnalité à implémenter avec un lecteur USB');
}

// ====================================================================
// GESTION DES STOCKS
// ====================================================================

function chargerStocks() {
    console.log('📊 Chargement des stocks');
    afficherTableauStock();
    afficherMouvementsRecents();
    afficherAlertesStock();
}

function afficherTableauStock() {
    const tbody = document.getElementById('tableauStockBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    produitsData.forEach(produit => {
        const etat = determinerEtatStock(produit.stock, produit.seuilAlerte);
        const valeur = produit.stock * produit.prix;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="info-produit">
                    <div class="icone-produit">
                        <i class="fa-solid ${produit.icone}"></i>
                    </div>
                    <div class="details-produit">
                        <h4>${produit.nom}</h4>
                        <span class="code-barre">${produit.codeBarre}</span>
                    </div>
                </div>
            </td>
            <td><span class="badge-categorie badge-${produit.categorie}">${produit.categorie}</span></td>
            <td><strong class="qte-stock">${produit.stock}</strong></td>
            <td>${produit.seuilAlerte}</td>
            <td>${valeur.toLocaleString()} FCFA</td>
            <td><span class="badge-etat etat-${etat.classe}">${etat.libelle}</span></td>
            <td>-</td>
            <td>
                <div class="actions-stock">
                    <button class="btn-icone btn-voir" title="Historique" onclick="voirHistoriqueStock('${produit.id}')">
                        <i class="fa-solid fa-history"></i>
                    </button>
                    <button class="btn-icone btn-modifier" title="Ajuster" onclick="ajusterStock('${produit.id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

function afficherMouvementsRecents() {
    const container = document.getElementById('listeMouvements');
    if (!container) return;
    
    container.innerHTML = '';
    
    mouvementsData.slice(0, 5).forEach(mouvement => {
        const div = document.createElement('div');
        div.className = `mouvement-item mouvement-${mouvement.type}`;
        
        const icon = mouvement.type === 'entree' ? 'arrow-up' : 
                     mouvement.type === 'sortie' ? 'arrow-down' : 'exclamation-triangle';
        
        const badge = mouvement.type === 'entree' ? 'badge-entree' : 
                      mouvement.type === 'sortie' ? 'badge-vente' : 'badge-perte';
        
        div.innerHTML = `
            <div class="mouvement-icon">
                <i class="fa-solid fa-${icon}"></i>
            </div>
            <div class="mouvement-info">
                <strong>${mouvement.type === 'entree' ? 'Entrée' : 'Sortie'} - ${mouvement.produitNom}</strong>
                <span class="mouvement-details">${mouvement.type === 'entree' ? '+' : '-'}${mouvement.quantite} unités</span>
                <span class="mouvement-date">
                    <i class="fa-regular fa-clock"></i> ${mouvement.date}
                </span>
            </div>
            <span class="mouvement-badge ${badge}">${mouvement.motif}</span>
        `;
        
        container.appendChild(div);
    });
}

function afficherAlertesStock() {
    const container = document.getElementById('listeAlertesStock');
    if (!container) return;
    
    container.innerHTML = '';
    
    produitsData.forEach(produit => {
        if (produit.stock < produit.seuilAlerte) {
            const div = document.createElement('div');
            div.className = produit.stock === 0 ? 'alerte-stock critique' : 
                           produit.stock < produit.seuilAlerte / 2 ? 'alerte-stock critique' : 
                           'alerte-stock avertissement';
            
            div.innerHTML = `
                <i class="fa-solid fa-${produit.stock === 0 ? 'ban' : 'exclamation-triangle'}"></i>
                <div class="alerte-details">
                    <strong>${produit.nom}</strong>
                    <span>${produit.stock === 0 ? 'Rupture de stock' : `Stock critique: ${produit.stock} unités (seuil: ${produit.seuilAlerte})`}</span>
                </div>
                <button class="btn-alerte-action" onclick="ouvrirModalMouvementStock('entree', '${produit.id}')">
                    Approvisionner
                </button>
            `;
            
            container.appendChild(div);
        }
    });
    
    if (container.children.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 2rem;">Aucune alerte stock</p>';
    }
}

function ouvrirModalMouvementStock(type, produitId = null) {
    const modal = document.getElementById('modalMouvementStock');
    const titre = document.getElementById('titreMouvementStock');
    const groupeMotif = document.getElementById('groupeMotifSortie');
    const inputType = document.getElementById('typeMouvementStock');
    
    if (!modal) return;
    
    document.getElementById('formMouvementStock').reset();
    inputType.value = type;
    
    if (type === 'entree') {
        titre.innerHTML = '<i class="fa-solid fa-arrow-up"></i> Entrée de Stock';
        groupeMotif.style.display = 'none';
    } else {
        titre.innerHTML = '<i class="fa-solid fa-arrow-down"></i> Sortie de Stock';
        groupeMotif.style.display = 'block';
    }
    
    // Remplir la liste des produits
    const select = document.getElementById('produitMouvement');
    select.innerHTML = '<option value="">Sélectionner un produit</option>';
    produitsData.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nom;
        if (produitId === p.id) option.selected = true;
        select.appendChild(option);
    });
    
    modal.classList.add('active');
}

function fermerModalMouvementStock() {
    const modal = document.getElementById('modalMouvementStock');
    if (modal) {
        modal.classList.remove('active');
    }
}

function ouvrirModalPerte() {
    const modal = document.getElementById('modalPerte');
    if (!modal) return;
    
    document.getElementById('formPerte').reset();
    
    // Remplir la liste des produits
    const select = document.getElementById('produitPerte');
    select.innerHTML = '<option value="">Sélectionner un produit</option>';
    produitsData.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nom;
        select.appendChild(option);
    });
    
    modal.classList.add('active');
}

function fermerModalPerte() {
    const modal = document.getElementById('modalPerte');
    if (modal) {
        modal.classList.remove('active');
    }
}

function ajusterStock(produitId) {
    ouvrirModalMouvementStock('entree', produitId);
}

function voirHistoriqueStock(produitId) {
    alert(`Historique des mouvements pour le produit ${produitId}\nFonctionnalité à implémenter`);
}

function filtrerParEtatStock() {
    const filtre = document.getElementById('filtreEtatStock')?.value;
    // Implémenter le filtrage
    afficherTableauStock();
}

function exporterStock() {
    alert('Export des données de stock\nFonctionnalité à implémenter avec le backend PHP');
}

// ====================================================================
// GESTION DES CRÉDITS
// ====================================================================

function chargerCredits() {
    console.log('💳 Chargement des crédits');
    afficherTableauCredits();
    afficherRemboursementsRecents();
}

function afficherTableauCredits() {
    const tbody = document.getElementById('tableauCreditsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    creditData.forEach(credit => {
        const tr = document.createElement('tr');
        const badgeEtat = credit.etat === 'retard' ? 'etat-retard' : 
                         credit.etat === 'en-cours' ? 'etat-en-cours' : 'etat-rembourse';
        const libelleEtat = credit.etat === 'retard' ? 'En retard' : 
                           credit.etat === 'en-cours' ? 'En cours' : 'Remboursé';
        
        tr.innerHTML = `
            <td><strong>${credit.id}</strong></td>
            <td>${credit.client}</td>
            <td>${credit.montantInitial.toLocaleString()} FCFA</td>
            <td><strong>${credit.montantRestant.toLocaleString()} FCFA</strong></td>
            <td>${credit.dateCredit}</td>
            <td>${credit.joursEcoules} jour${credit.joursEcoules > 1 ? 's' : ''}</td>
            <td><span class="badge-etat ${badgeEtat}">${libelleEtat}</span></td>
            <td>
                <div class="actions-credit">
                    <button class="btn-icone btn-voir" title="Voir détails" onclick="voirDetailCredit('${credit.id}')">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn-icone btn-modifier" title="Rembourser" onclick="ouvrirModalRemboursement('${credit.id}')">
                        <i class="fa-solid fa-money-bill"></i>
                    </button>
                    ${credit.etat === 'retard' ? `
                    <button class="btn-icone btn-message" title="Relancer" onclick="relancerClient('${credit.id}')">
                        <i class="fa-solid fa-envelope"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

function afficherRemboursementsRecents() {
    // Afficher les derniers remboursements
    // À implémenter
}

function ouvrirModalRemboursement(creditId = null) {
    const modal = document.getElementById('modalRemboursement');
    if (!modal) return;
    
    document.getElementById('formRemboursement').reset();
    
    // Remplir la liste des crédits
    const select = document.getElementById('creditRemboursement');
    select.innerHTML = '<option value="">Sélectionner un crédit</option>';
    creditData.filter(c => c.montantRestant > 0).forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = `${c.id} - ${c.client} (${c.montantRestant.toLocaleString()} FCFA)`;
        if (creditId === c.id) option.selected = true;
        select.appendChild(option);
    });
    
    if (creditId) {
        afficherInfoCredit();
    }
    
    modal.classList.add('active');
}

function fermerModalRemboursement() {
    const modal = document.getElementById('modalRemboursement');
    if (modal) {
        modal.classList.remove('active');
    }
}

function afficherInfoCredit() {
    const select = document.getElementById('creditRemboursement');
    const info = document.getElementById('infoCreditRemboursement');
    const montantRestant = document.getElementById('montantRestant');
    
    const creditId = select.value;
    if (!creditId) {
        info.style.display = 'none';
        return;
    }
    
    const credit = creditData.find(c => c.id === creditId);
    if (credit) {
        montantRestant.textContent = credit.montantRestant.toLocaleString() + ' FCFA';
        info.style.display = 'block';
    }
}

function voirDetailCredit(creditId) {
    const credit = creditData.find(c => c.id === creditId);
    if (credit) {
        alert(`Détails du crédit ${creditId}\n\nClient: ${credit.client}\nMontant initial: ${credit.montantInitial} FCFA\nMontant restant: ${credit.montantRestant} FCFA\nDate: ${credit.dateCredit}\nJours écoulés: ${credit.joursEcoules}`);
    }
}

function relancerClient(creditId) {
    if (confirm('Envoyer une relance au client ?')) {
        afficherNotification('Relance envoyée avec succès', 'success');
    }
}

function filtrerParEtatCredit() {
    const filtre = document.getElementById('filtreEtatCredit')?.value;
    // Implémenter le filtrage
    afficherTableauCredits();
}

function exporterCredits() {
    alert('Export des crédits\nFonctionnalité à implémenter');
}

// ====================================================================
// GESTION DES INVENTAIRES
// ====================================================================

function chargerInventaires() {
    console.log('📋 Chargement des inventaires');
}

function creerNouvelInventaire() {
    if (confirm('Démarrer un nouvel inventaire ?')) {
        alert('Création d\'un nouvel inventaire\nFonctionnalité à implémenter');
    }
}

function voirDetailInventaire(invId) {
    alert(`Détails de l'inventaire ${invId}\nFonctionnalité à implémenter`);
}

function telechargerInventaire(invId) {
    alert(`Téléchargement de l'inventaire ${invId}\nFonctionnalité à implémenter`);
}

function exporterInventaire() {
    alert('Export de l\'inventaire\nFonctionnalité à implémenter');
}

// ====================================================================
// GESTION DES RAPPORTS
// ====================================================================

function chargerRapports() {
    console.log('📊 Chargement des rapports');
    // Charger les graphiques si Chart.js est disponible
    if (typeof Chart !== 'undefined') {
        chargerGraphiques();
    }
}

function changerPeriodeRapport() {
    const periode = document.getElementById('periodeRapport')?.value;
    const periodePerso = document.getElementById('periodePersonnalisee');
    
    if (periode === 'personnalise' && periodePerso) {
        periodePerso.style.display = 'flex';
    } else if (periodePerso) {
        periodePerso.style.display = 'none';
    }
}

function appliquerPeriode() {
    const dateDebut = document.getElementById('dateDebut')?.value;
    const dateFin = document.getElementById('dateFin')?.value;
    
    if (dateDebut && dateFin) {
        console.log('Période:', dateDebut, 'à', dateFin);
        // Recharger les données
    }
}

function genererRapportComplet() {
    alert('Génération du rapport complet PDF\nFonctionnalité à implémenter avec le backend PHP');
}

function exporterDonnees() {
    alert('Export des données Excel\nFonctionnalité à implémenter');
}

function telechargerRapport(type) {
    alert(`Téléchargement du rapport ${type}\nFonctionnalité à implémenter`);
}

function chargerGraphiques() {
    // Graphiques avec Chart.js
    // À implémenter quand Chart.js sera chargé
}

// ====================================================================
// GESTION DES ALERTES
// ====================================================================

function chargerAlertes() {
    console.log('🔔 Chargement des alertes');
}

function afficherAlertes() {
    afficherSection('alertes');
}

function filtrerAlertes(type) {
    console.log('Filtrer alertes:', type);
    // Implémenter le filtrage

    
    // Mettre à jour les boutons actifs
    const boutons = document.querySelectorAll('.btn-filtre');
    boutons.forEach(btn => btn.classList.remove('actif'));
    event.target.classList.add('actif');
}

function marquerToutesLues() {
    const alertes = document.querySelectorAll('.alerte-detaillee.non-lue');
    alertes.forEach(alerte => {
        alerte.classList.remove('non-lue');
    });
    afficherNotification('Toutes les alertes ont été marquées comme lues', 'success');
}

function marquerLue(element) {
    const alerte = element.closest('.alerte-detaillee');
    if (alerte) {
        alerte.classList.remove('non-lue');
        afficherNotification('Alerte marquée comme lue', 'success');
    }
}

function approvisionner(produitId) {
    ouvrirModalMouvementStock('entree', produitId);
    if (document.getElementById('modalAlertes')) {
        document.getElementById('modalAlertes').classList.remove('active');
    }
}


// ====================================================================
// INITIALISATION DES ÉVÉNEMENTS
// ====================================================================

function initialiserEvenements() {
    // Fermeture des modals au clic sur l'overlay
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Formulaire produit
    const formProduit = document.getElementById('formProduit');
    if (formProduit) {
        formProduit.addEventListener('submit', function(e) {
            e.preventDefault();
            enregistrerProduit();
        });
    }
    
    // Formulaire mouvement stock
    const formMouvement = document.getElementById('formMouvementStock');
    if (formMouvement) {
        formMouvement.addEventListener('submit', function(e) {
            e.preventDefault();
            enregistrerMouvementStock();
        });
    }
    
    // Formulaire perte
    const formPerte = document.getElementById('formPerte');
    if (formPerte) {
        formPerte.addEventListener('submit', function(e) {
            e.preventDefault();
            enregistrerPerte();
        });
    }
    
    // Formulaire remboursement
    const formRemboursement = document.getElementById('formRemboursement');
    if (formRemboursement) {
        formRemboursement.addEventListener('submit', function(e) {
            e.preventDefault();
            enregistrerRemboursement();
        });
    }
    
    // Gestion du montant reçu et rendu de monnaie
    const montantRecu = document.getElementById('montantRecu');
    if (montantRecu) {
        montantRecu.addEventListener('input', function() {
            calculerRenduMonnaie();
        });
    }
    
    console.log('✅ Événements initialisés');
}

function enregistrerProduit() {
    const nom = document.getElementById('nomProduit').value;
    const codeBarre = document.getElementById('codeBarreProduit').value;
    const categorie = document.getElementById('categorieProduit').value;
    const prix = parseFloat(document.getElementById('prixProduit').value);
    const stock = parseInt(document.getElementById('stockInitial').value);
    const seuilAlerte = parseInt(document.getElementById('seuilAlerte').value);
    
    const nouveauProduit = {
        id: 'PROD' + Date.now(),
        nom: nom,
        codeBarre: codeBarre,
        categorie: categorie,
        prix: prix,
        stock: stock,
        seuilAlerte: seuilAlerte,
        icone: 'fa-box'
    };
    
    produitsData.push(nouveauProduit);
    afficherProduits(produitsData);
    fermerModalProduit();
    afficherNotification('Produit ajouté avec succès', 'success');
}

function enregistrerMouvementStock() {
    const type = document.getElementById('typeMouvementStock').value;
    const produitId = document.getElementById('produitMouvement').value;
    const quantite = parseInt(document.getElementById('quantiteMouvement').value);
    const commentaire = document.getElementById('commentaireMouvement').value;
    
    const produit = produitsData.find(p => p.id === produitId);
    if (!produit) {
        afficherNotification('Produit introuvable', 'error');
        return;
    }
    
    if (type === 'sortie' && quantite > produit.stock) {
        afficherNotification('Stock insuffisant', 'error');
        return;
    }
    
    // Mettre à jour le stock
    if (type === 'entree') {
        produit.stock += quantite;
    } else {
        produit.stock -= quantite;
    }
    
    // Ajouter le mouvement
    mouvementsData.unshift({
        id: mouvementsData.length + 1,
        type: type,
        produitId: produitId,
        produitNom: produit.nom,
        quantite: quantite,
        motif: type === 'entree' ? 'Approvisionnement' : document.getElementById('motifSortie').value,
        date: new Date().toLocaleString('fr-FR'),
        commentaire: commentaire
    });
    
    afficherTableauStock();
    afficherMouvementsRecents();
    afficherAlertesStock();
    fermerModalMouvementStock();
    afficherNotification(`${type === 'entree' ? 'Entrée' : 'Sortie'} de stock enregistrée`, 'success');
}

function enregistrerPerte() {
    const produitId = document.getElementById('produitPerte').value;
    const quantite = parseInt(document.getElementById('quantitePerte').value);
    const raison = document.getElementById('raisonPerte').value;
    const justification = document.getElementById('justificationPerte').value;
    
    const produit = produitsData.find(p => p.id === produitId);
    if (!produit) {
        afficherNotification('Produit introuvable', 'error');
        return;
    }
    
    if (quantite > produit.stock) {
        afficherNotification('Quantité supérieure au stock disponible', 'error');
        return;
    }
    
    produit.stock -= quantite;
    
    mouvementsData.unshift({
        id: mouvementsData.length + 1,
        type: 'perte',
        produitId: produitId,
        produitNom: produit.nom,
        quantite: quantite,
        motif: raison,
        date: new Date().toLocaleString('fr-FR'),
        commentaire: justification
    });
    
    afficherTableauStock();
    afficherMouvementsRecents();
    fermerModalPerte();
    afficherNotification('Perte enregistrée avec succès', 'success');
}

function enregistrerRemboursement() {
    const creditId = document.getElementById('creditRemboursement').value;
    const montant = parseFloat(document.getElementById('montantRembourse').value);
    
    const credit = creditData.find(c => c.id === creditId);
    if (!credit) {
        afficherNotification('Crédit introuvable', 'error');
        return;
    }
    
    if (montant > credit.montantRestant) {
        afficherNotification('Montant supérieur au montant restant', 'error');
        return;
    }
    
    credit.montantRestant -= montant;
    
    if (credit.montantRestant === 0) {
        credit.etat = 'rembourse';
    }
    
    afficherTableauCredits();
    fermerModalRemboursement();
    afficherNotification('Remboursement enregistré avec succès', 'success');
}

function calculerRenduMonnaie() {
    const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    const montantRecu = parseFloat(document.getElementById('montantRecu')?.value) || 0;
    const rendu = montantRecu - total;
    
    const montantRendu = document.getElementById('montantRendu');
    if (montantRendu) {
        if (rendu >= 0) {
            montantRendu.textContent = rendu.toLocaleString() + ' FCFA';
            montantRendu.style.color = '#28a745';
        } else {
            montantRendu.textContent = 'Montant insuffisant';
            montantRendu.style.color = '#dc3545';
        }
    }
}

// ====================================================================
// FONCTION DE DEBUG
// ====================================================================

console.log('📱 Système de Gestion Boutique UIYA chargé');
console.log('Version: 1.0.0');
console.log('Développé par: Groupe 1 - IGL L2');