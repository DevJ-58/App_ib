// ====================================================================
// SYSTÈME DE GESTION DE STOCK BOUTIQUE UIYA - MAIN.JS (CORRIGÉ)
// ====================================================================

// ====================================================================
// VARIABLES GLOBALES
// ====================================================================

let utilisateurConnecte = null;

let panier = [];
let produitsData = [];
let stockData = [];
let creditData = [];
let ventesData = [];
let mouvementsData = [];
let alertesData = [];
let typePaiementActuel = 'comptant';
let categoriesData = ['Boissons', 'Snacks', 'Alimentaire', 'Hygiène'];

// ====================================================================
// SYSTÈME D'AUTHENTIFICATION
// ====================================================================

// Initialiser les données fictives au premier chargement
function initialiserAuthentification() {
    if (!localStorage.getItem('utilisateurs')) {
        // Données fictives d'utilisateurs
        const utilisateursFictifs = [
            {
                id: 1,
                nom: "IB",
                prenom: "Mr",
                telephone: "0123456789",
                email: "mr@uiya.com",
                motDePasse: "123456",
                role: "admin",
                photo: null
            },
            {
                id: 2,
                nom: "Dupont",
                prenom: "Jean",
                telephone: "0987654321",
                email: "jean@uiya.com",
                motDePasse: "password123",
                role: "vendeur",
                photo: null
            },
            {
                id: 3,
                nom: "Martin",
                prenom: "Marie",
                telephone: "0555555555",
                email: "marie@uiya.com",
                motDePasse: "password123",
                role: "vendeur",
                photo: null
            }
        ];
        localStorage.setItem('utilisateurs', JSON.stringify(utilisateursFictifs));
    }
    
    // Vérifier si un utilisateur est déjà connecté
    const sessionUtilisateur = localStorage.getItem('utilisateurConnecte');
    if (sessionUtilisateur) {
        utilisateurConnecte = JSON.parse(sessionUtilisateur);
    }
}

// Fonction de connexion
function seConnecter(telephone, motDePasse) {
    const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
    const utilisateur = utilisateurs.find(u => u.telephone === telephone && u.motDePasse === motDePasse);
    
    if (utilisateur) {
        // Supprimer le mot de passe avant de stocker la session
        const sessionData = {
            id: utilisateur.id,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom,
            telephone: utilisateur.telephone,
            email: utilisateur.email,
            role: utilisateur.role,
            photo: utilisateur.photo
        };
        
        utilisateurConnecte = sessionData;
        localStorage.setItem('utilisateurConnecte', JSON.stringify(sessionData));
        
        return {
            success: true,
            message: `Bienvenue ${utilisateur.prenom} ${utilisateur.nom}!`
        };
    }
    
    return {
        success: false,
        message: "Téléphone ou mot de passe incorrect"
    };
}

// Fonction d'inscription
function sInscrire(nom, prenom, telephone, email, motDePasse, confirmMotDePasse) {
    // Vérification des champs
    if (!nom || !prenom || !telephone || !email || !motDePasse || !confirmMotDePasse) {
        return {
            success: false,
            message: "Tous les champs sont obligatoires"
        };
    }
    
    if (motDePasse !== confirmMotDePasse) {
        return {
            success: false,
            message: "Les mots de passe ne correspondent pas"
        };
    }
    
    if (motDePasse.length < 6) {
        return {
            success: false,
            message: "Le mot de passe doit contenir au moins 6 caractères"
        };
    }
    
    const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
    
    // Vérifier si l'utilisateur existe déjà
    if (utilisateurs.some(u => u.telephone === telephone || u.email === email)) {
        return {
            success: false,
            message: "Un utilisateur avec ce téléphone ou cet email existe déjà"
        };
    }
    
    // Créer le nouvel utilisateur
    const nouvelUtilisateur = {
        id: utilisateurs.length + 1,
        nom: nom,
        prenom: prenom,
        telephone: telephone,
        email: email,
        motDePasse: motDePasse,
        role: "vendeur",
        photo: null
    };
    
    utilisateurs.push(nouvelUtilisateur);
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
    
    // Connecter automatiquement après l'inscription
    const sessionData = {
        id: nouvelUtilisateur.id,
        nom: nouvelUtilisateur.nom,
        prenom: nouvelUtilisateur.prenom,
        telephone: nouvelUtilisateur.telephone,
        email: nouvelUtilisateur.email,
        role: nouvelUtilisateur.role,
        photo: nouvelUtilisateur.photo
    };
    
    utilisateurConnecte = sessionData;
    localStorage.setItem('utilisateurConnecte', JSON.stringify(sessionData));
    
    return {
        success: true,
        message: `Bienvenue ${prenom} ${nom}!`
    };
}

// Fonction de déconnexion
function deconnecterUtilisateur() {
    utilisateurConnecte = null;
    localStorage.removeItem('utilisateurConnecte');
}

// Vérifier si l'utilisateur est authentifié
function estAuthentifie() {
    return utilisateurConnecte !== null;
}

// Rediriger vers la page de connexion si non authentifié (pour le dashboard)
function verifierAuthentification() {
    const pageActuelle = window.location.pathname.toLowerCase();
    
    // Vérifier si on est sur une page protégée
    if (pageActuelle.includes('dashbord.html') || pageActuelle.includes('dashboard')) {
        if (!estAuthentifie()) {
            window.location.href = '../HTML/connexion.html';
        }
    }
}

// ====================================================================
// INITIALISATION AU CHARGEMENT
// ====================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du système...');
    
    // Initialiser l'authentification
    initialiserAuthentification();
    
    // Vérifier l'authentification pour les pages protégées
    verifierAuthentification();
    
    // Initialiser les formulaires d'authentification
    initialiserFormulairesAuthentification();
    
    // Initialiser l'affichage du dashboard si authentifié
    initialiserDashboard();
});

// ====================================================================
// GESTION DES FORMULAIRES D'AUTHENTIFICATION
// ====================================================================

function initialiserFormulairesAuthentification() {
    // Gestion de la connexion
    const formConnexion = document.getElementById('formConnexion');
    if (formConnexion) {
        // Soumettre le formulaire
        formConnexion.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const telephone = document.getElementById('telephone').value;
            const motDePasse = document.getElementById('motDePasse').value;
            const messageDiv = document.getElementById('messageErreur');
            
            const resultat = seConnecter(telephone, motDePasse);
            
            if (resultat.success) {
                // Afficher un message de succès
                messageDiv.style.display = 'block';
                messageDiv.style.backgroundColor = '#d5f4e6';
                messageDiv.style.color = '#27ae60';
                messageDiv.textContent = resultat.message;
                
                // Rediriger après 1.5 secondes
                setTimeout(() => {
                    window.location.href = 'dashbord.html';
                }, 1500);
            } else {
                // Afficher le message d'erreur
                messageDiv.style.display = 'block';
                messageDiv.style.backgroundColor = '#fadbd8';
                messageDiv.style.color = '#e74c3c';
                messageDiv.textContent = resultat.message;
            }
        });
        
        // Masquer le message d'erreur quand l'utilisateur commence à taper
        const champsTelephone = document.getElementById('telephone');
        const champsMotDePasse = document.getElementById('motDePasse');
        const messageDivConnexion = document.getElementById('messageErreur');
        
        if (champsTelephone) {
            champsTelephone.addEventListener('focus', function() {
                messageDivConnexion.style.display = 'none';
            });
        }
        if (champsMotDePasse) {
            champsMotDePasse.addEventListener('focus', function() {
                messageDivConnexion.style.display = 'none';
            });
        }
    }
    
    // Gestion de l'inscription
    const formInscription = document.getElementById('formInscription');
    if (formInscription) {
        // Soumettre le formulaire
        formInscription.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nom = document.getElementById('nom').value;
            const prenom = document.getElementById('prenom').value;
            const telephone = document.getElementById('telephone').value;
            const email = document.getElementById('email').value;
            const motDePasse = document.getElementById('motDePasse').value;
            const confirmMotDePasse = document.getElementById('confirmMotDePasse').value;
            const messageDiv = document.getElementById('messageErreur');
            
            const resultat = sInscrire(nom, prenom, telephone, email, motDePasse, confirmMotDePasse);
            
            if (resultat.success) {
                // Afficher un message de succès
                messageDiv.style.display = 'block';
                messageDiv.style.backgroundColor = '#d5f4e6';
                messageDiv.style.color = '#27ae60';
                messageDiv.textContent = resultat.message;
                
                // Rediriger après 1.5 secondes
                setTimeout(() => {
                    window.location.href = 'dashbord.html';
                }, 1500);
            } else {
                // Afficher le message d'erreur
                messageDiv.style.display = 'block';
                messageDiv.style.backgroundColor = '#fadbd8';
                messageDiv.style.color = '#e74c3c';
                messageDiv.textContent = resultat.message;
            }
        });
        
        // Masquer le message d'erreur quand l'utilisateur commence à taper
        const champsInscription = [
            document.getElementById('nom'),
            document.getElementById('prenom'),
            document.getElementById('telephone'),
            document.getElementById('email'),
            document.getElementById('motDePasse'),
            document.getElementById('confirmMotDePasse')
        ];
        
        const messageDivInscription = document.getElementById('messageErreur');
        
        champsInscription.forEach(champ => {
            if (champ) {
                champ.addEventListener('focus', function() {
                    messageDivInscription.style.display = 'none';
                });
            }
        });
    }
}

function initialiserDashboard() {
    const pageActuelle = window.location.pathname.toLowerCase();
    
    // Si on est sur le dashboard et authentifié
    if (estAuthentifie() && (pageActuelle.includes('dashbord') || pageActuelle.includes('dashboard'))) {
        // Charger les données initiales
        chargerDonneesInitiales();
        
        // Initialiser les événements
        initialiserEvenements();
        
        // Mettre à jour le nom de l'utilisateur dans l'en-tête
        const nomElement = document.querySelector('.nom-utilisateur');
        if (nomElement && utilisateurConnecte) {
            nomElement.textContent = utilisateurConnecte.prenom + ' ' + utilisateurConnecte.nom;
        }
        
        // Afficher la section dashboard par défaut
        afficherSection('dashboard');
        
        // Charger le dashboard avec statistiques et graphiques
        chargerDashboard();
        
        console.log('✅ Système initialisé avec succès');
    }
}

// ====================================================================
// INITIALISATION PAGES D'ACCUEIL
// ====================================================================

function initialiserPagesAccueil() {
    // Vérifier si déjà connecté (pour pages de connexion/inscription)
    const pageActuelle = window.location.pathname.toLowerCase();
    
    if (estAuthentifie() && 
        (pageActuelle.includes('connexion.html') || 
         pageActuelle.includes('inscription.html'))) {
        window.location.href = 'dashbord.html';
    }
}

// ====================================================================
// CHARGEMENT DES DONNÉES
// ====================================================================

function chargerDonneesInitiales() {
    // Charger les produits - DONNÉES MINIMALES POUR DEMO
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
            id: 'PAIN001',
            nom: 'Pain français',
            codeBarre: '2345678901234',
            categorie: 'alimentaire',
            prix: 200,
            stock: 8,
            seuilAlerte: 15,
            icone: 'fa-bread-slice'
        },
        {
            id: 'SUCRE001',
            nom: 'Sucre 1kg',
            codeBarre: '1111111111111',
            categorie: 'alimentaire',
            prix: 800,
            stock: 12,
            seuilAlerte: 8,
            icone: 'fa-jar'
        }
    ];
    
    // Charger les stocks
    stockData = JSON.parse(JSON.stringify(produitsData));
    
    // Charger les crédits - MINIMAL
    creditData = [
        {
            id: 'C-001',
            client: 'Koné Abou',
            montantInitial: 15000,
            montantRestant: 12000,
            dateCreation: '05/12/2025',
            etat: 'actif'
        },
        {
            id: 'C-002',
            client: 'Yao Marc',
            montantInitial: 8500,
            montantRestant: 0,
            dateCreation: '10/12/2025',
            etat: 'rembourse'
        }
    ];
    
    // Charger les mouvements - MINIMAL
    mouvementsData = [
        {
            id: 1,
            type: 'entree',
            produitId: 'COCA001',
            produitNom: 'Coca-Cola 50cl',
            quantite: 20,
            motif: 'Approvisionnement',
            date: '14/12/2025 10:30'
        },
        {
            id: 2,
            type: 'sortie',
            produitId: 'EAU001',
            produitNom: 'Eau minérale 1.5L',
            quantite: 10,
            motif: 'Vente',
            date: '14/12/2025 09:15'
        }
    ];
    
    // Ventesdata minimal
    ventesData = [
        {
            id: 1,
            produitId: 'COCA001',
            produitNom: 'Coca-Cola 50cl',
            quantite: 2,
            prixUnitaire: 500,
            montantTotal: 1000,
            client: 'Client 1',
            typePaiement: 'comptant',
            date: '16/01/2026 14:30'
        }
    ];
    
    console.log(' Données DEMO chargées:', {
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
    
    // Mettre à jour le menu actif - CORRECTION ICI
    const liens = document.querySelectorAll('.menu-navigation a');
    liens.forEach(lien => {
        lien.classList.remove('actif');
        const parent = lien.closest('li');
        if (parent) {
            parent.classList.remove('actif');
        }
    });
    
    // Ajouter la classe actif au lien correspondant
    const lienActif = document.querySelector(`.menu-navigation a[onclick*="'${nomSection}'"]`);
    if (lienActif) {
        lienActif.classList.add('actif');
        const parentActif = lienActif.closest('li');
        if (parentActif) {
            parentActif.classList.add('actif');
        }
    }
    
    // Fermer le menu mobile si ouvert
    const barreLaterale = document.getElementById('barreLaterale');
    if (barreLaterale && window.innerWidth <= 768) {
        barreLaterale.classList.remove('active');
    }
    
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

function deconnecter() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        deconnecterUtilisateur();
        window.location.href = '../HTML/connexion.html';
    }
}

// ====================================================================
// GESTION DU PROFIL
// ====================================================================

function ouvrirModalProfil() {
    const modal = document.getElementById('modalProfil');
    if (modal && utilisateurConnecte) {
        // Charger les informations dans la modale
        document.getElementById('profilPrenom').value = utilisateurConnecte.prenom || '';
        document.getElementById('profilNom').value = utilisateurConnecte.nom || '';
        document.getElementById('profilTelephone').value = utilisateurConnecte.telephone || '';
        document.getElementById('profilEmail').value = utilisateurConnecte.email || '';
        
        // Charger la photo de profil
        const photoPreview = document.getElementById('profilPhotoPreview');
        if (utilisateurConnecte.photo) {
            photoPreview.src = utilisateurConnecte.photo;
        } else {
            photoPreview.src = 'https://via.placeholder.com/120';
        }
        
        // Vider les champs de mot de passe
        document.getElementById('profilMotDePasseActuel').value = '';
        document.getElementById('profilNouveauMotDePasse').value = '';
        document.getElementById('profilConfirmMotDePasse').value = '';
        
        // Réinitialiser l'input file
        document.getElementById('profilPhotoInput').value = '';
        
        // Masquer les messages
        document.getElementById('messageProfilErreur').style.display = 'none';
        document.getElementById('messageProfilSucces').style.display = 'none';
        
        // Afficher la modale
        modal.style.display = 'flex';
    }
}

function fermerModalProfil() {
    const modal = document.getElementById('modalProfil');
    if (modal) {
        modal.style.display = 'none';
    }
}

function sauvegarderProfil() {
    const motDePasseActuel = document.getElementById('profilMotDePasseActuel').value;
    const nouveauMotDePasse = document.getElementById('profilNouveauMotDePasse').value;
    const confirmMotDePasse = document.getElementById('profilConfirmMotDePasse').value;
    const photoInput = document.getElementById('profilPhotoInput');
    const messageDiv = document.getElementById('messageProfilErreur');
    const successDiv = document.getElementById('messageProfilSucces');
    
    // Masquer les messages
    messageDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Vérifier si l'utilisateur veut modifier le mot de passe
    if (nouveauMotDePasse || motDePasseActuel || confirmMotDePasse) {
        // Les trois champs doivent être remplis
        if (!motDePasseActuel || !nouveauMotDePasse || !confirmMotDePasse) {
            afficherMessageProfil('messageProfilErreur', 'Veuillez remplir tous les champs de mot de passe');
            return;
        }
        
        if (nouveauMotDePasse !== confirmMotDePasse) {
            afficherMessageProfil('messageProfilErreur', 'Les nouveaux mots de passe ne correspondent pas');
            return;
        }
        
        if (nouveauMotDePasse.length < 6) {
            afficherMessageProfil('messageProfilErreur', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
            return;
        }
        
        // Vérifier le mot de passe actuel
        const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
        const utilisateur = utilisateurs.find(u => u.id === utilisateurConnecte.id);
        
        if (!utilisateur || utilisateur.motDePasse !== motDePasseActuel) {
            afficherMessageProfil('messageProfilErreur', 'Mot de passe actuel incorrect');
            return;
        }
        
        // Mettre à jour le mot de passe
        utilisateur.motDePasse = nouveauMotDePasse;
        localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
        
        afficherMessageProfil('messageProfilSucces', 'Mot de passe modifié avec succès !');
    }
    
    // Gérer la photo de profil
    if (photoInput.files && photoInput.files[0]) {
        const file = photoInput.files[0];
        
        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            afficherMessageProfil('messageProfilErreur', 'La photo ne doit pas dépasser 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // Mettre à jour la photo dans localStorage
            const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
            const utilisateur = utilisateurs.find(u => u.id === utilisateurConnecte.id);
            
            if (utilisateur) {
                utilisateur.photo = e.target.result;
                utilisateurConnecte.photo = e.target.result;
                localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
                localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateurConnecte));
                
                // Mettre à jour la photo dans l'en-tête
                const imgHeader = document.querySelector('.profil img');
                if (imgHeader) {
                    imgHeader.src = e.target.result;
                }
                
                afficherMessageProfil('messageProfilSucces', 'Photo mise à jour avec succès !');
            }
        };
        reader.readAsDataURL(file);
    } else if (!motDePasseActuel && !nouveauMotDePasse && !confirmMotDePasse) {
        afficherMessageProfil('messageProfilSucces', 'Profil consulté !');
    }
    
    // Fermer la modale après 2 secondes
    setTimeout(() => {
        fermerModalProfil();
    }, 2000);
}

function afficherMessageProfil(divId, message) {
    const div = document.getElementById(divId);
    if (div) {
        div.textContent = message;
        div.style.display = 'block';
    }
}

// Event listener pour préview de la photo
document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('profilPhotoInput');
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(preview) {
                    const photoPreview = document.getElementById('profilPhotoPreview');
                    if (photoPreview) {
                        photoPreview.src = preview.target.result;
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
});

// Fermer la modale en cliquant en dehors
document.addEventListener('click', function(event) {
    const modal = document.getElementById('modalProfil');
    if (modal && event.target === modal) {
        fermerModalProfil();
    }
});

// Fermer la modale avec la touche Échap
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        fermerModalProfil();
    }
});

// ====================================================================
// GESTION DU DASHBOARD
// ====================================================================

function chargerDashboard() {
    console.log('📊 Chargement du dashboard');
    mettreAJourStatistiques();
    chargerProduitsPopulaires();
    
    // Charger le graphique si Chart.js est disponible
    if (typeof Chart !== 'undefined') {
        setTimeout(() => initialiserChartDashboard(), 100);
    }
}

function initialiserChartDashboard() {
    const canvas = document.getElementById('chartVentes7Jours');
    if (!canvas) return;

    const labels = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
    }

    const ventesSimulees = [120000, 95000, 110000, 125000, 98000, 140000, 130000];

    // Détruire le graphique précédent si présent
    if (window._chartVentes7Jours) {
        try { 
            window._chartVentes7Jours.destroy(); 
        } catch (e) { 
            console.log('Graphique déjà détruit');
        }
    }

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
    let ventesJour = 125000;
    let produitsVendus = 48;
    let valeurStock = 0;
    let creditsEnCours = 0;
    
    produitsData.forEach(p => {
        valeurStock += p.stock * p.prix;
    });
    
    creditData.forEach(c => {
        if (c.etat !== 'rembourse') {
            creditsEnCours += c.montantRestant;
        }
    });
    
    // Mettre à jour les affichages
    const elementsStatistiques = {
        ventesJour: document.querySelectorAll('.carte-stat.ventes p'),
        produitsVendus: document.querySelectorAll('.carte-stat.produits p'),
        valeurStock: document.querySelectorAll('.carte-stat.stock p'),
        creditsEnCours: document.querySelectorAll('.carte-stat.credits p')
    };
    
    // Mise à jour sécurisée
    if (elementsStatistiques.valeurStock.length > 0) {
        elementsStatistiques.valeurStock[0].textContent = valeurStock.toLocaleString() + ' FCFA';
    }
    
    if (elementsStatistiques.creditsEnCours.length > 0) {
        elementsStatistiques.creditsEnCours[0].textContent = creditsEnCours.toLocaleString() + ' FCFA';
    }
    
    // Mettre à jour les totaux dans le panneau de filtres (produits)
    const totalProduits = document.getElementById('totalProduits');
    if (totalProduits) {
        totalProduits.textContent = produitsData.length;
    }
    
    const stockCritique = document.getElementById('stockCritique');
    if (stockCritique) {
        const nbCritique = produitsData.filter(p => p.stock < p.seuilAlerte).length;
        stockCritique.textContent = nbCritique;
    }
    
    const valeurTotale = document.getElementById('valeurTotale');
    if (valeurTotale) {
        valeurTotale.textContent = valeurStock.toLocaleString() + ' FCFA';
    }
}

function telechargerRapportJournalier() {
    afficherNotification('Génération du rapport en cours...', 'info');
    setTimeout(() => {
        afficherNotification('Rapport journalier téléchargé avec succès', 'success');
    }, 1500);
}

// ====================================================================
// GESTION DES PRODUITS
// ====================================================================

function chargerProduits() {
    console.log('📦 Chargement des produits');
    afficherProduits(produitsData);
    mettreAJourStatistiques();
}

function afficherProduits(produits) {
    const tbody = document.getElementById('corpTableauProduits');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (produits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #6c757d;">Aucun produit trouvé</td></tr>';
        return;
    }
    
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
            form.dataset.mode = 'modifier';
            form.dataset.produitId = produitId;
        }
    } else {
        titre.innerHTML = '<i class="fa-solid fa-plus"></i> Ajouter un Produit';
        form.dataset.mode = 'ajouter';
        delete form.dataset.produitId;
    }
    
    modal.classList.add('active');
}

function fermerModalProduit() {
    const modal = document.getElementById('modalProduit');
    if (modal) {
        modal.classList.remove('active');
    }
}

function ouvrirModalCategorie(mode = 'ajouter', categorieId = null){
    const modalC = document.getElementById('modalCategorie');
    const formC = document.getElementById('formCategorie');
    const nomCategorieInput = document.getElementById('nomCategorie');

    if(!modalC) return;
    
    // Réinitialiser le formulaire
    formC.reset();
    nomCategorieInput.focus();

    // Afficher la modale avec la classe active
    modalC.classList.add('active');
    
    // Afficher l'onglet d'ajout par défaut
    basculerTabCategorie('ajouter');
    
    // Mettre à jour la liste des catégories
    afficherListeCategories();
}

// Basculer entre les onglets de la modale
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
        // Rafraîchir la liste
        afficherListeCategories();
    }
}

// Fermer la modale des catégories
function fermerModalCategorie() {
    const modalC = document.getElementById('modalCategorie');
    if (modalC) {
        modalC.classList.remove('active');
    }
}

// Gérer la soumission du formulaire des catégories
document.addEventListener('DOMContentLoaded', function() {
    const formCategorie = document.getElementById('formCategorie');
    if (formCategorie) {
        formCategorie.addEventListener('submit', function(e) {
            e.preventDefault();
            ajouterCategorie();
        });
    }

    // Fermer la modale en cliquant en dehors
    const modalCategorie = document.getElementById('modalCategorie');
    if (modalCategorie) {
        modalCategorie.addEventListener('click', function(e) {
            if (e.target === modalCategorie) {
                fermerModalCategorie();
            }
        });
    }
});

// Ajouter une nouvelle catégorie
function ajouterCategorie() {
    const nomCategorieInput = document.getElementById('nomCategorie');
    const nomCategorie = nomCategorieInput.value.trim();

    // Validation
    if (!nomCategorie) {
        afficherNotification('Veuillez entrer un nom de catégorie', 'error');
        return;
    }

    // Vérifier si la catégorie existe déjà
    if (categoriesData.some(cat => cat.toLowerCase() === nomCategorie.toLowerCase())) {
        afficherNotification('Cette catégorie existe déjà', 'error');
        return;
    }

    // Ajouter la catégorie à la liste
    categoriesData.push(nomCategorie);

    // Mettre à jour tous les selects de catégorie
    mettreAJourSelectCategories();

    // Afficher une notification de succès
    afficherNotification(`Catégorie "${nomCategorie}" ajoutée avec succès`, 'success');

    // Fermer la modale
    fermerModalCategorie();

    // Réinitialiser le formulaire
    document.getElementById('formCategorie').reset();
}

// Mettre à jour tous les selects de catégories
function mettreAJourSelectCategories() {
    // Mettre à jour le select du filtre
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

        // Restaurer la sélection précédente
        if (selectedValue) {
            filtreCategorie.value = selectedValue;
        }
    }

    // Mettre à jour le select du formulaire de produit
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

        // Restaurer la sélection précédente
        if (selectedValue) {
            categorieProduit.value = selectedValue;
        }
    }

    // Mettre à jour la liste des catégories affichées (s'il existe)
    afficherListeCategories();
}

// Afficher la liste des catégories avec boutons de suppression et modification
function afficherListeCategories() {
    const listeContainer = document.getElementById('listeCategories');
    if (!listeContainer) return;

    // Créer le HTML de la liste
    let html = '<div class="categories-list">';
    
    if (categoriesData.length === 0) {
        html += '<p style="text-align: center; color: #6c757d;">Aucune catégorie</p>';
    } else {
        categoriesData.forEach((cat, index) => {
            const nbProduits = produitsData.filter(p => p.categorie.toLowerCase() === cat.toLowerCase()).length;
            html += `
                <div class="categorie-item" id="categorie-item-${index}">
                    <div class="categorie-info">
                        <span class="categorie-nom" id="nom-categorie-${index}">${cat}</span>
                        <span class="categorie-count">${nbProduits} produit${nbProduits !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="categorie-actions">
                        <button class="btn-modifier-categorie" onclick="demarrerModificationCategorie('${index}', '${cat}')" title="Modifier">
                            <i class="fa-solid fa-edit"></i>
                        </button>
                        <button class="btn-supprimer-categorie" onclick="supprimerCategorie('${cat}')" title="Supprimer">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    html += '</div>';
    listeContainer.innerHTML = html;
}

// Démarrer la modification d'une catégorie
function demarrerModificationCategorie(index, ancienNom) {
    const item = document.getElementById(`categorie-item-${index}`);
    if (!item) return;

    const nomSpan = document.getElementById(`nom-categorie-${index}`);
    const actionsDiv = item.querySelector('.categorie-actions');
    
    // Créer l'input de modification
    let html = `
        <div class="categorie-modification">
            <input type="text" id="input-modif-${index}" class="input-modification" value="${ancienNom}" required>
            <div class="modification-actions">
                <button class="btn-action-mini btn-sauvegarder" onclick="sauvegarderModificationCategorie('${index}', '${ancienNom}')">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button class="btn-action-mini btn-annuler" onclick="annulerModificationCategorie('${index}')">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        </div>
    `;

    // Remplacer le contenu
    nomSpan.style.display = 'none';
    actionsDiv.style.display = 'none';
    
    const modifDiv = document.createElement('div');
    modifDiv.innerHTML = html;
    modifDiv.id = `modif-div-${index}`;
    item.insertBefore(modifDiv.firstElementChild, actionsDiv);
    
    // Donner le focus à l'input
    const inputModif = document.getElementById(`input-modif-${index}`);
    if (inputModif) {
        inputModif.focus();
        inputModif.select();
    }
}

// Sauvegarder la modification d'une catégorie
function sauvegarderModificationCategorie(index, ancienNom) {
    const inputModif = document.getElementById(`input-modif-${index}`);
    if (!inputModif) return;

    const nouveauNom = inputModif.value.trim();

    // Validation
    if (!nouveauNom) {
        afficherNotification('Veuillez entrer un nom de catégorie', 'error');
        return;
    }

    // Vérifier si le nom est identique
    if (nouveauNom.toLowerCase() === ancienNom.toLowerCase()) {
        annulerModificationCategorie(index);
        return;
    }

    // Vérifier si le nouveau nom existe déjà
    if (categoriesData.some(cat => cat.toLowerCase() === nouveauNom.toLowerCase() && cat.toLowerCase() !== ancienNom.toLowerCase())) {
        afficherNotification('Cette catégorie existe déjà', 'error');
        return;
    }

    // Trouver l'index dans categoriesData
    const indexData = categoriesData.findIndex(cat => cat.toLowerCase() === ancienNom.toLowerCase());
    if (indexData !== -1) {
        // Mettre à jour les produits qui utilisent cette catégorie
        produitsData.forEach(produit => {
            if (produit.categorie.toLowerCase() === ancienNom.toLowerCase()) {
                produit.categorie = nouveauNom;
            }
        });

        // Mettre à jour categoriesData
        categoriesData[indexData] = nouveauNom;

        // Mettre à jour les selects
        mettreAJourSelectCategories();

        // Afficher notification
        afficherNotification(`Catégorie "${ancienNom}" renommée en "${nouveauNom}"`, 'success');

        // Rafraîchir la liste
        afficherListeCategories();
    }
}

// Annuler la modification d'une catégorie
function annulerModificationCategorie(index) {
    const item = document.getElementById(`categorie-item-${index}`);
    if (!item) return;

    const modifDiv = item.querySelector('.categorie-modification');
    const nomSpan = document.getElementById(`nom-categorie-${index}`);
    const actionsDiv = item.querySelector('.categorie-actions');

    if (modifDiv) {
        modifDiv.remove();
    }

    nomSpan.style.display = '';
    actionsDiv.style.display = '';
}

// Supprimer une catégorie
function supprimerCategorie(categorie) {
    // Vérifier si la catégorie est utilisée
    const produitsConcerned = produitsData.filter(p => p.categorie.toLowerCase() === categorie.toLowerCase());
    
    if (produitsConcerned.length > 0) {
        afficherNotification(
            `Impossible de supprimer "${categorie}": ${produitsConcerned.length} produit(s) utilise(nt) cette catégorie`,
            'error'
        );
        return;
    }

    // Demander confirmation
    const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categorie}" ?`);
    
    if (!confirmation) {
        return;
    }

    // Supprimer la catégorie
    const indexCategorie = categoriesData.findIndex(cat => cat.toLowerCase() === categorie.toLowerCase());
    
    if (indexCategorie !== -1) {
        categoriesData.splice(indexCategorie, 1);
        
        // Mettre à jour les interfaces
        mettreAJourSelectCategories();
        
        // Afficher notification
        afficherNotification(`Catégorie "${categorie}" supprimée avec succès`, 'success');
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
    stockData = stockData.filter(p => p.id !== produitId);
    afficherProduits(produitsData);
    mettreAJourStatistiques();
    afficherNotification('Produit supprimé avec succès', 'success');
}

function voirDetailProduit(produitId) {
    const produit = produitsData.find(p => p.id === produitId);
    if (produit) {
        alert(`Détails du produit:\n\nNom: ${produit.nom}\nCode-barre: ${produit.codeBarre}\nCatégorie: ${produit.categorie}\nPrix: ${produit.prix.toLocaleString()} FCFA\nStock: ${produit.stock} unités\nSeuil d'alerte: ${produit.seuilAlerte}`);
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
    afficherNotification('Scanner de code-barre activé', 'info');
    // Simulation d'un scan
    setTimeout(() => {
        const codeBarre = '12345' + Math.floor(Math.random() * 100000);
        document.getElementById('codeBarreProduit').value = codeBarre;
        afficherNotification('Code-barre scanné: ' + codeBarre, 'success');
    }, 1000);
}

// ====================================================================
// GESTION DES VENTES
// ====================================================================

function chargerVentes() {
    console.log('🛒 Chargement des ventes');
    chargerProduitsPopulaires();
    afficherPanier();
}

function chargerProduitsPopulaires() {
    const container = document.getElementById('produitsRapides');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Afficher les 6 premiers produits avec stock > 0
    produitsData
        .filter(p => p.stock > 0)
        .slice(0, 6)
        .forEach(produit => {
            const carte = document.createElement('div');
            carte.className = 'produit-rapide';
            carte.innerHTML = `
                <i class="fa-solid ${produit.icone}"></i>
                <h5>${produit.nom}</h5>
                <p>${produit.prix.toLocaleString()} FCFA</p>
            `;
            carte.onclick = () => ajouterAuPanier(produit.id);
            container.appendChild(carte);
        });
}

function afficherProduitsRapides() {
    chargerProduitsPopulaires();
}

function ajouterAuPanier(produitId) {
    const produit = produitsData.find(p => p.id === produitId);
    if (!produit) return;
    
    if (produit.stock <= 0) {
        afficherNotification('Stock insuffisant pour ' + produit.nom, 'error');
        return;
    }
    
    const itemPanier = panier.find(item => item.id === produitId);
    
    if (itemPanier) {
        if (itemPanier.quantite >= produit.stock) {
            afficherNotification('Stock insuffisant pour ajouter plus de ' + produit.nom, 'warning');
            return;
        }
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
    afficherNotification(produit.nom + ' ajouté au panier', 'success');
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
    
    // Recalculer le rendu de monnaie si applicable
    if (typePaiementActuel === 'comptant') {
        calculerRenduMonnaie();
    }
}

function modifierQuantitePanier(index, delta) {
    if (!panier[index]) return;
    
    const produit = produitsData.find(p => p.id === panier[index].id);
    if (!produit) return;
    
    const nouvelleQuantite = panier[index].quantite + delta;
    
    if (nouvelleQuantite > produit.stock) {
        afficherNotification('Stock insuffisant', 'warning');
        return;
    }
    
    if (nouvelleQuantite <= 0) {
        panier.splice(index, 1);
    } else {
        panier[index].quantite = nouvelleQuantite;
    }
    
    afficherPanier();
}

function retirerDuPanier(index) {
    if (confirm('Retirer cet article du panier ?')) {
        panier.splice(index, 1);
        afficherPanier();
        afficherNotification('Article retiré du panier', 'info');
    }
}

function selectionnerPaiement(type) {
    typePaiementActuel = type;
    const champClient = document.getElementById('champClient');
    const zoneMontant = document.getElementById('zoneMontantRecu');
    const options = document.querySelectorAll('.option-paiement > div');
    
    // Retirer l'état actif de toutes les options
    options.forEach(opt => opt.classList.remove('actif'));
    
    // Ajouter l'état actif à l'option cliquée
    event.target.closest('div').classList.add('actif');
    
    if (type === 'credit') {
        champClient.style.display = 'block';
        zoneMontant.classList.remove('visible');
    } else {
        champClient.style.display = 'none';
        zoneMontant.classList.add('visible');
        calculerRenduMonnaie();
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
    } else {
        afficherNotification('Le panier est déjà vide', 'info');
    }
}

function validerVente() {
    if (panier.length === 0) {
        afficherNotification('Le panier est vide', 'error');
        return;
    }
    
    // Vérifier le type de paiement
    if (typePaiementActuel === 'credit') {
        const nomClient = document.getElementById('nomClient')?.value.trim();
        if (!nomClient) {
            afficherNotification('Veuillez saisir le nom du client pour un crédit', 'error');
            return;
        }
    } else {
        // Vérifier le montant reçu
        const montantRecu = parseFloat(document.getElementById('montantRecu')?.value) || 0;
        const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
        
        if (montantRecu < total) {
            afficherNotification('Montant reçu insuffisant', 'error');
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
        type: typePaiementActuel === 'credit' ? 'À crédit' : 'Comptant',
        date: new Date().toLocaleString('fr-FR'),
        client: document.getElementById('nomClient')?.value || 'Client',
        montantRecu: typePaiementActuel === 'comptant' ? parseFloat(document.getElementById('montantRecu')?.value) || 0 : 0
    };
    
    // Mettre à jour les stocks
    panier.forEach(item => {
        const produit = produitsData.find(p => p.id === item.id);
        if (produit) {
            produit.stock -= item.quantite;
            
            // Ajouter un mouvement de stock
            mouvementsData.unshift({
                id: mouvementsData.length + 1,
                type: 'sortie',
                produitId: produit.id,
                produitNom: produit.nom,
                quantite: item.quantite,
                motif: 'Vente',
                date: vente.date,
                commentaire: 'Vente ' + vente.id
            });
        }
    });
    
    // Si c'est un crédit, l'ajouter à la liste des crédits
    if (typePaiementActuel === 'credit') {
        creditData.push({
            id: 'C-' + (Date.now() % 1000).toString().padStart(3, '0'),
            client: vente.client,
            montantInitial: total,
            montantRestant: total,
            dateCredit: new Date().toLocaleDateString('fr-FR'),
            joursEcoules: 0,
            etat: 'en-cours'
        });
    }
    
    // Afficher le ticket
    afficherTicket(vente);
    
    // Réinitialiser le panier
    panier = [];
    afficherPanier();
    document.getElementById('nomClient').value = '';
    document.getElementById('montantRecu').value = '';
    mettreAJourStatistiques();
    
    console.log('✅ Vente validée:', vente);
}

function afficherTicket(vente) {
    const modal = document.getElementById('modalTicket');
    const numeroTicket = document.getElementById('numeroTicket');
    const dateTicket = document.getElementById('dateTicket');
    const itemsTicket = document.getElementById('itemsTicket');
    const totalTicket = dadocument.getElementById('totalTicket');
    const infosPaiement = document.getElementById('infosPaiement');
    const texteSucces = document.getElementById('texteSucces');
    
    if (!modal) return;
    
    numeroTicket.textContent = vente.id;
    dateTicket.textContent = vente.date;
    totalTicket.textContent = vente.total.toLocaleString() + ' FCFA';
    
    let infoPaiementText = `Type: ${vente.type} - Client: ${vente.client}`;
    if (vente.type === 'Comptant') {
        const rendu = vente.montantRecu - vente.total;
        infoPaiementText += `\nMontant reçu: ${vente.montantRecu.toLocaleString()} FCFA - Rendu: ${rendu.toLocaleString()} FCFA`;
    }
    infosPaiement.textContent = infoPaiementText;
    
    texteSucces.textContent = 'Vente enregistrée avec succès !';
    
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
    afficherNotification('Fonctionnalité en développement', 'info');
}

function activerScanner() {
    afficherNotification('Scanner de code-barre activé', 'info');
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
    
    if (mouvementsData.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 2rem;">Aucun mouvement</p>';
        return;
    }
    
    mouvementsData.slice(0, 5).forEach(mouvement => {
        const div = document.createElement('div');
        div.className = `mouvement-item mouvement-${mouvement.type}`;
        
        const icon = mouvement.type === 'entree' ? 'arrow-up' : 
                     mouvement.type === 'sortie' ? 'arrow-down' : 'exclamation-triangle';
        
        const badge = mouvement.type === 'entree' ? 'badge-entree' : 
                      mouvement.type === 'sortie' ? 'badge-vente' : 'badge-perte';
        
        const typeLibelle = mouvement.type === 'entree' ? 'Entrée' : 
                           mouvement.type === 'sortie' ? 'Sortie' : 'Perte';
        
        div.innerHTML = `
            <div class="mouvement-icon">
                <i class="fa-solid fa-${icon}"></i>
            </div>
            <div class="mouvement-info">
                <strong>${typeLibelle} - ${mouvement.produitNom}</strong>
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
    
    let alertes = 0;
    
    produitsData.forEach(produit => {
        if (produit.stock < produit.seuilAlerte) {
            alertes++;
            const div = document.createElement('div');
            div.className = produit.stock === 0 ? 'alerte-stock critique' : 
                           produit.stock < produit.seuilAlerte / 2 ? 'alerte-stock critique' : 
                           'alerte-stock avertissement';
            
            const message = produit.stock === 0 ? 'Rupture de stock' : 
                           `Stock critique: ${produit.stock} unités (seuil: ${produit.seuilAlerte})`;
            
            div.innerHTML = `
                <i class="fa-solid fa-${produit.stock === 0 ? 'ban' : 'exclamation-triangle'}"></i>
                <div class="alerte-details">
                    <strong>${produit.nom}</strong>
                    <span>${message}</span>
                </div>
                <button class="btn-alerte-action" onclick="ouvrirModalMouvementStock('entree', '${produit.id}')">
                    Approvisionner
                </button>
            `;
            
            container.appendChild(div);
        }
    });
    
    if (alertes === 0) {
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
        option.textContent = `${p.nom} (Stock actuel: ${p.stock})`;
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
        option.textContent = `${p.nom} (Stock actuel: ${p.stock})`;
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
    const produit = produitsData.find(p => p.id === produitId);
    if (!produit) return;
    
    const historique = mouvementsData.filter(m => m.produitId === produitId);
    
    let message = `Historique des mouvements pour ${produit.nom}:\n\n`;
    
    if (historique.length === 0) {
        message += 'Aucun mouvement enregistré';
    } else {
        historique.forEach(m => {
            message += `${m.date} - ${m.type === 'entree' ? 'Entrée' : m.type === 'sortie' ? 'Sortie' : 'Perte'}: ${m.quantite} unités (${m.motif})\n`;
        });
    }
    
    alert(message);
}

function filtrerParEtatStock() {
    const filtre = document.getElementById('filtreEtatStock')?.value;
    
    if (!filtre) {
        afficherTableauStock();
        return;
    }
    
    const tbody = document.getElementById('tableauStockBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const produitsFiltres = produitsData.filter(p => {
        const etat = determinerEtatStock(p.stock, p.seuilAlerte);
        return etat.classe === filtre;
    });
    
    produitsFiltres.forEach(produit => {
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
    
    if (produitsFiltres.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: #6c757d;">Aucun produit trouvé</td></tr>';
    }
}

function exporterStock() {
    afficherNotification('Export des données en cours...', 'info');
    setTimeout(() => {
        afficherNotification('Données exportées avec succès', 'success');
    }, 1500);
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
                    ${credit.montantRestant > 0 ? `
                    <button class="btn-icone btn-modifier" title="Rembourser" onclick="ouvrirModalRemboursement('${credit.id}')">
                        <i class="fa-solid fa-money-bill"></i>
                    </button>
                    ` : ''}
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
    // Fonctionnalité à implémenter avec les données de remboursement
    console.log('Remboursements récents affichés');
}

function ouvrirModalRemboursement(creditId = null) {
    const modal = document.getElementById('modalRemboursement');
    if (!modal) return;
    
    document.getElementById('formRemboursement').reset();
    
    // Remplir la liste des crédits non remboursés
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
        alert(`Détails du crédit ${creditId}\n\nClient: ${credit.client}\nMontant initial: ${credit.montantInitial.toLocaleString()} FCFA\nMontant restant: ${credit.montantRestant.toLocaleString()} FCFA\nDate: ${credit.dateCredit}\nJours écoulés: ${credit.joursEcoules}\nÉtat: ${credit.etat}`);
    }
}

function relancerClient(creditId) {
    const credit = creditData.find(c => c.id === creditId);
    if (credit) {
        if (confirm(`Envoyer une relance à ${credit.client} ?\n\nMontant dû: ${credit.montantRestant.toLocaleString()} FCFA`)) {
            afficherNotification('Relance envoyée à ' + credit.client, 'success');
        }
    }
}

function filtrerParEtatCredit() {
    const filtre = document.getElementById('filtreEtatCredit')?.value;
    
    if (!filtre) {
        afficherTableauCredits();
        return;
    }
    
    const tbody = document.getElementById('tableauCreditsBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const creditsFiltres = creditData.filter(c => c.etat === filtre);
    
    creditsFiltres.forEach(credit => {
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
                    ${credit.montantRestant > 0 ? `
                    <button class="btn-icone btn-modifier" title="Rembourser" onclick="ouvrirModalRemboursement('${credit.id}')">
                        <i class="fa-solid fa-money-bill"></i>
                    </button>
                    ` : ''}
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
    
    if (creditsFiltres.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: #6c757d;">Aucun crédit trouvé</td></tr>';
    }
}

function exporterCredits() {
    afficherNotification('Export des crédits en cours...', 'info');
    setTimeout(() => {
        afficherNotification('Crédits exportés avec succès', 'success');
    }, 1500);
}

// ====================================================================
// GESTION DES INVENTAIRES
// ====================================================================

function chargerInventaires() {
    console.log('📋 Chargement des inventaires');
}

function creerNouvelInventaire() {
    if (confirm('Démarrer un nouvel inventaire ?\n\nCette action va créer une nouvelle session d\'inventaire.')) {
        afficherNotification('Nouvel inventaire créé', 'success');
        // Implémenter la logique de création d'inventaire
    }
}

function voirDetailInventaire(invId) {
    afficherNotification('Détails de l\'inventaire ' + invId, 'info');
}

function telechargerInventaire(invId) {
    afficherNotification('Téléchargement de l\'inventaire ' + invId, 'info');
}

function exporterInventaire() {
    afficherNotification('Export de l\'inventaire en cours...', 'info');
}

// ====================================================================
// GESTION DES RAPPORTS
// ====================================================================

function chargerRapports() {
    console.log('📊 Chargement des rapports');
    // Charger les graphiques si Chart.js est disponible
    if (typeof Chart !== 'undefined') {
        setTimeout(() => chargerGraphiques(), 100);
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
        afficherNotification('Période appliquée: ' + dateDebut + ' à ' + dateFin, 'success');
    } else {
        afficherNotification('Veuillez sélectionner une période complète', 'warning');
    }
}

function genererRapportComplet() {
    afficherNotification('Génération du rapport complet en cours...', 'info');
    setTimeout(() => {
        afficherNotification('Rapport complet généré avec succès', 'success');
    }, 2000);
}

function exporterDonnees() {
    afficherNotification('Export des données en cours...', 'info');
    setTimeout(() => {
        afficherNotification('Données exportées avec succès', 'success');
    }, 1500);
}

function telechargerRapport(type) {
    afficherNotification(`Téléchargement du rapport ${type} en cours...`, 'info');
    setTimeout(() => {
        afficherNotification(`Rapport ${type} téléchargé avec succès`, 'success');
    }, 1500);
}

function chargerGraphiques() {
    // Créer les trois graphiques pour les rapports
    console.log('📊 Chargement des graphiques rapports');
    
    // Créer les graphiques avec un délai pour laisser les canvas se charger
    setTimeout(() => {
        creerGraphiqueCA();
        creerGraphiqueCategories();
        creerGraphiqueTopProduits();
    }, 50);
}

function creerGraphiqueCA() {
    const canvas = document.getElementById('canvasCA');
    if (!canvas) return;

    // Générer les labels pour les 30 derniers jours
    const labels = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }));
    }

    // Générer des données simulées
    const donnees = Array.from({length: 30}, () => Math.floor(Math.random() * 500000) + 100000);

    // Détruire le graphique précédent si présent
    if (window._chartCA) {
        try { 
            window._chartCA.destroy(); 
        } catch (e) { 
            console.log('Graphique CA déjà détruit');
        }
    }

    const parent = canvas.parentElement;
    if (parent) parent.style.height = '350px';

    window._chartCA = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Chiffre d\'Affaires (FCFA)',
                data: donnees,
                backgroundColor: 'rgba(46,213,115,0.1)',
                borderColor: 'rgba(46,213,115,1)',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(46,213,115,1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true, 
                    position: 'top',
                    labels: { font: { size: 12 }, padding: 15 }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: { callback: function(value) { return (value / 1000).toFixed(0) + 'K'; } }
                }
            }
        }
    });
}

function creerGraphiqueCategories() {
    const canvas = document.getElementById('canvasCategories');
    if (!canvas) return;

    const categories = ['Boissons', 'Alimentaire', 'Snacks', 'Hygiène', 'Électronique'];
    const ventes = [45, 25, 18, 7, 5];
    const couleurs = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

    // Détruire le graphique précédent si présent
    if (window._chartCategories) {
        try { 
            window._chartCategories.destroy(); 
        } catch (e) { 
            console.log('Graphique Catégories déjà détruit');
        }
    }

    const parent = canvas.parentElement;
    if (parent) parent.style.height = '350px';

    window._chartCategories = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: ventes,
                backgroundColor: couleurs,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'right',
                    labels: { font: { size: 12 }, padding: 15 }
                }
            }
        }
    });
}

function creerGraphiqueTopProduits() {
    const canvas = document.getElementById('canvasTopProduits');
    if (!canvas) return;

    const produits = ['Coca 50cl', 'Pain', 'Eau 1.5L', 'Café Nescafé', 'Biscuits', 'Lait Nido', 'Sucre', 'Huile', 'Riz', 'Pâtes'];
    const ventes = [450, 380, 320, 290, 250, 200, 180, 160, 140, 120];

    // Détruire le graphique précédent si présent
    if (window._chartTopProduits) {
        try { 
            window._chartTopProduits.destroy(); 
        } catch (e) { 
            console.log('Graphique Top Produits déjà détruit');
        }
    }

    const parent = canvas.parentElement;
    if (parent) parent.style.height = '350px';

    window._chartTopProduits = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: produits,
            datasets: [{
                label: 'Unités vendues',
                data: ventes,
                backgroundColor: 'rgba(102,126,234,0.8)',
                borderColor: 'rgba(102,126,234,1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    labels: { font: { size: 12 }, padding: 15 }
                }
            },
            scales: {
                x: { 
                    beginAtZero: true
                }
            }
        }
    });
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
    
    // Mettre à jour les boutons actifs
    const boutons = document.querySelectorAll('.btn-filtre');
    boutons.forEach(btn => btn.classList.remove('actif'));
    
    if (event && event.target) {
        const btnActif = event.target.closest('.btn-filtre');
        if (btnActif) {
            btnActif.classList.add('actif');
        }
    }
    
    // Implémenter le filtrage des alertes
    afficherNotification(`Affichage des alertes: ${type}`, 'info');
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
}

// ====================================================================
// INITIALISATION DES ÉVÉNEMENTS
// ====================================================================

function initialiserEvenements() {
    // Initialiser les catégories dans les selects
    mettreAJourSelectCategories();
    
    // Fermeture des modals au clic sur l'overlay
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
   
    }
    
const formProduit = document.getElementById('formProduit');

if (formProduit) {
    formProduit.addEventListener('submit', function (e) {
        const mode = formProduit.dataset.mode || 'ajouter';

        if (mode === 'modifier') {
            // En mode modification → AJAX
            e.preventDefault();
            enregistrerProduit();
        }
        // En mode ajout → AUCUN preventDefault
        // Le formulaire s'envoie normalement vers create.php
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
        montantRecu.addEventListener('input', calculerRenduMonnaie);
        montantRecu.addEventListener('change', calculerRenduMonnaie);
    }
    
    // ====================================================================
    // GESTION DES RECHERCHES
    // ====================================================================
    
    // Recherche dans la section ventes
    const rechercheVente = document.getElementById('rechercheVente');
    if (rechercheVente) {
        rechercheVente.addEventListener('input', function(e) {
            const terme = e.target.value.toLowerCase().trim();
            const grilleProduits = document.querySelector('.grille-produits-rapides');
            
            if (!grilleProduits) return;
            
            if (terme.length === 0) {
                // Afficher tous les produits
                afficherProduitsRapides();
            } else {
                // Filtrer les produits
                const resultats = produitsData.filter(p => 
                    (p.nom && p.nom.toLowerCase().includes(terme)) || 
                    (p.codeBarre && p.codeBarre.includes(terme))
                );
                
                if (resultats.length === 0) {
                    grilleProduits.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">Aucun produit trouvé</p>';
                } else {
                    // Afficher les résultats
                    grilleProduits.innerHTML = resultats.map(p => `
                        <div class="produit-rapide" onclick="ajouterAuPanier(${p.id})">
                            <i class="fa-solid fa-box"></i>
                            <h5>${p.nom}</h5>
                            <p>${p.prix.toLocaleString()} FCFA</p>
                        </div>
                    `).join('');
                }
            }
        });
    }
    
    // Recherche dans la section produits
    const champRecherche = document.getElementById('champRecherche');
    if (champRecherche) {
        champRecherche.addEventListener('input', function(e) {
            const terme = e.target.value.toLowerCase().trim();
            const tableauProduits = document.querySelector('.tableau-produits tbody');
            
            if (!tableauProduits) return;
            
            if (terme.length === 0) {
                afficherTableauProduits();
            } else {
                const resultats = produitsData.filter(p =>
                    (p.nom && p.nom.toLowerCase().includes(terme)) ||
                    (p.codeBarre && p.codeBarre.includes(terme)) ||
                    (p.categorie && p.categorie.toLowerCase().includes(terme))
                );
                
                if (resultats.length === 0) {
                    tableauProduits.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">Aucun produit trouvé</td></tr>';
                } else {
                    tableauProduits.innerHTML = resultats.map(p => {
                        const etat = determinerEtatStock(p.stock, p.seuilAlerte);
                        return `
                            <tr>
                                <td>${p.id}</td>
                                <td>${p.nom}</td>
                                <td>${p.categorie}</td>
                                <td>${p.prix.toLocaleString()} FCFA</td>
                                <td><span class="badge-etat ${etat.classe}">${etat.libelle}</span></td>
                                <td>
                                    <button class="btn-icone" onclick="editerProduit(${p.id})"><i class="fa-solid fa-edit"></i></button>
                                    <button class="btn-icone" onclick="supprimerProduit(${p.id})"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        `;
                    }).join('');
                }
            }
        });
    }
    
    // Recherche dans la section stock
    const rechercheStock = document.getElementById('rechercheStock');
    if (rechercheStock) {
        rechercheStock.addEventListener('input', function(e) {
            const terme = e.target.value.toLowerCase().trim();
            const tableauStock = document.querySelector('.tableau-stock tbody');
            
            if (!tableauStock) return;
            
            if (terme.length === 0) {
                afficherTableauStock();
            } else {
                const resultats = stockData.filter(s =>
                    (s.nom && s.nom.toLowerCase().includes(terme)) ||
                    (s.codeBarre && s.codeBarre.includes(terme))
                );
                
                if (resultats.length === 0) {
                    tableauStock.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">Aucun produit trouvé</td></tr>';
                } else {
                    tableauStock.innerHTML = resultats.map(s => {
                        const produit = produitsData.find(p => p.id === s.produitId);
                        const etat = determinerEtatStock(s.quantite, s.seuilAlerte);
                        const valeurStock = s.quantite * (produit?.prix || 0);
                        return `
                            <tr>
                                <td>${s.id}</td>
                                <td>${s.nom}</td>
                                <td>${s.categorie}</td>
                                <td>${s.quantite}</td>
                                <td>${s.seuilAlerte}</td>
                                <td>${valeurStock.toLocaleString()} FCFA</td>
                                <td><span class="badge-etat ${etat.classe}">${etat.libelle}</span></td>
                                <td>${s.derniereEntree || '-'}</td>
                            </tr>
                        `;
                    }).join('');
                }
            }
        });
    }
    
    // Recherche dans la section crédits
    const rechercheCredit = document.getElementById('rechercheCredit');
    if (rechercheCredit) {
        rechercheCredit.addEventListener('input', function(e) {
            const terme = e.target.value.toLowerCase().trim();
            const tableauCredits = document.querySelector('.tableau-credits tbody');
            
            if (!tableauCredits) return;
            
            if (terme.length === 0) {
                afficherTableauCredits();
            } else {
                const resultats = creditData.filter(c =>
                    (c.client && c.client.toLowerCase().includes(terme))
                );
                
                if (resultats.length === 0) {
                    tableauCredits.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">Aucun crédit trouvé</td></tr>';
                } else {
                    tableauCredits.innerHTML = resultats.map(c => {
                        const jours = Math.ceil((new Date() - new Date(c.dateCreation)) / (1000 * 60 * 60 * 24));
                        return `
                            <tr>
                                <td>${c.id}</td>
                                <td>${c.client}</td>
                                <td>${c.montantInitial.toLocaleString()} FCFA</td>
                                <td>${c.montantRestant.toLocaleString()} FCFA</td>
                                <td>${c.dateCreation}</td>
                                <td>${jours} j</td>
                                <td><span class="badge-etat ${c.etat === 'actif' ? 'actif' : 'rembourse'}">${c.etat === 'actif' ? 'Actif' : 'Remboursé'}</span></td>
                            </tr>
                        `;
                    }).join('');
                }
            }
        });
    }
    
    console.log('✅ Événements initialisés');

function enregistrerProduit() {

    const formData = new FormData();

    formData.append('nom', document.getElementById('nomProduit').value.trim());
    formData.append('code_barre', document.getElementById('codeBarreProduit').value.trim());
    formData.append('categorie_id', document.getElementById('categorieProduit').value);
    formData.append('prix_unitaire', document.getElementById('prixProduit').value);
    formData.append('stock_actuel', document.getElementById('stockInitial').value);
    formData.append('seuil_alerte', document.getElementById('seuilAlerte')?.value || 0);

    fetch('/App_ib/backend/api/produit/create.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(msg => {
        afficherNotification(msg, 'success');
        fermerModalProduit();
    })
    .catch(() => {
        afficherNotification('Erreur serveur', 'error');
    });
}
async function enregistrerProduit() {
    // Récupérer les valeurs
    const nom = document.getElementById('nomProduit').value.trim();
    const codeBarre = document.getElementById('codeBarreProduit').value.trim();
    const categorie = document.getElementById('categorieProduit').value;
    const prix = parseFloat(document.getElementById('prixProduit').value);
    const stock = parseInt(document.getElementById('stockInitial').value);
    const seuilAlerte = parseInt(document.getElementById('seuilAlerte')?.value) || 0;

    // Validation front
    if (!nom || !codeBarre || !categorie || !prix || isNaN(stock) || isNaN(seuilAlerte)) {
        afficherNotification('Veuillez remplir tous les champs correctement', 'error');
        return;
    }

    // Préparer les données à envoyer
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('code_barre', codeBarre);
    formData.append('categorie_id', categorie); // ici, value doit être un ID numérique
    formData.append('prix_unitaire', prix);
    formData.append('stock_actuel', stock);
    formData.append('seuil_alerte', seuilAlerte);

    try {
        const response = await fetch('/App_ib/backend/api/produit/create.php', {
            method: 'POST',
            body: formData
        });

        const text = await response.text();

        if (response.status === 201) {
            // Ajout réussi → mettre à jour le tableau front
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
            mettreAJourStatistiques();
            fermerModalProduit();
            afficherNotification(text, 'success');
        } else {
            // Affiche le message d'erreur envoyé par PHP
            afficherNotification(text, 'error');
        }

    } catch (err) {
        console.error(err);
        afficherNotification('Erreur serveur, impossible d’ajouter le produit', 'error');
    }
}

function enregistrerMouvementStock() {
    const type = document.getElementById('typeMouvementStock').value;
    const produitId = document.getElementById('produitMouvement').value;
    const quantite = parseInt(document.getElementById('quantiteMouvement').value);
    const commentaire = document.getElementById('commentaireMouvement')?.value || '';
    
    if (!produitId || !quantite || quantite <= 0) {
        afficherNotification('Veuillez remplir tous les champs correctement', 'error');
        return;
    }
    
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
    const motif = type === 'entree' ? 'Approvisionnement' : 
                  document.getElementById('motifSortie')?.value || 'Sortie manuelle';
    
    mouvementsData.unshift({
        id: mouvementsData.length + 1,
        type: type,
        produitId: produitId,
        produitNom: produit.nom,
        quantite: quantite,
        motif: motif,
        date: new Date().toLocaleString('fr-FR'),
        commentaire: commentaire
    });
    
    afficherTableauStock();
    afficherMouvementsRecents();
    afficherAlertesStock();
    mettreAJourStatistiques();
    fermerModalMouvementStock();
    afficherNotification(`${type === 'entree' ? 'Entrée' : 'Sortie'} de stock enregistrée avec succès`, 'success');
}

function enregistrerPerte() {
    const produitId = document.getElementById('produitPerte').value;
    const quantite = parseInt(document.getElementById('quantitePerte').value);
    const raison = document.getElementById('raisonPerte').value;
    const justification = document.getElementById('justificationPerte').value.trim();
    
    if (!produitId || !quantite || quantite <= 0 || !raison || !justification) {
        afficherNotification('Veuillez remplir tous les champs correctement', 'error');
        return;
    }
    
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
    afficherAlertesStock();
    mettreAJourStatistiques();
    fermerModalPerte();
    afficherNotification('Perte enregistrée avec succès', 'success');
}

function enregistrerRemboursement() {
    const creditId = document.getElementById('creditRemboursement').value;
    const montant = parseFloat(document.getElementById('montantRembourse').value);
    const commentaire = document.getElementById('commentaireRemboursement')?.value || '';
    
    if (!creditId || !montant || montant <= 0) {
        afficherNotification('Veuillez remplir tous les champs correctement', 'error');
        return;
    }
    
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
    mettreAJourStatistiques();
    fermerModalRemboursement();
    afficherNotification('Remboursement de ' + montant.toLocaleString() + ' FCFA enregistré avec succès', 'success');
}

function calculerRenduMonnaie() {
    const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    const montantRecuInput = document.getElementById('montantRecu');
    const montantRenduElem = document.getElementById('montantRendu');
    
    if (!montantRecuInput || !montantRenduElem) return;
    
    const montantRecu = parseFloat(montantRecuInput.value) || 0;
    const rendu = montantRecu - total;
    
    if (rendu >= 0) {
        montantRenduElem.textContent = rendu.toLocaleString() + ' FCFA';
        montantRenduElem.style.color = '#28a745';
    } else {
        montantRenduElem.textContent = 'Montant insuffisant';
        montantRenduElem.style.color = '#dc3545';
    }
}

// ====================================================================
// FONCTIONS UTILITAIRES
// ====================================================================

function determinerEtatStock(stock, seuilAlerte) {
    if (stock === 0) {
        return { classe: 'rupture', libelle: 'Rupture' };
    } else if (stock < seuilAlerte / 2) {
        return { classe: 'critique', libelle: 'Critique' };
    } else if (stock < seuilAlerte) {
        return { classe: 'moyen', libelle: 'Moyen' };
    } else {
        return { classe: 'bon', libelle: 'Bon' };
    }
}

function afficherNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} show`;
    
    const icones = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fa-solid ${icones[type] || icones.info}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Afficher la notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Masquer et supprimer après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ====================================================================
// FONCTION DE DEBUG
// ====================================================================

console.log('📱 Système de Gestion Boutique UIYA chargé (VERSION CORRIGÉE)');
console.log('Version: 1.0.1');
console.log('Développé par: Groupe 1 - IGL L2');


