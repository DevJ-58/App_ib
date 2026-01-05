// ====================================================================
// FONCTIONS UTILITAIRES
// ====================================================================

function determinerEtatStock(quantite, seuil) {
    if (quantite === 0) {
        return { classe: 'rupture', libelle: 'Rupture' };
    } else if (quantite < seuil) {
        return { classe: 'critique', libelle: 'Critique' };
    } else if (quantite < seuil * 1.5) {
        return { classe: 'moyen', libelle: 'Moyen' };
    } else {
        return { classe: 'bon', libelle: 'Suffisant' };
    }
}


function afficherNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 type === 'warning' ? 'exclamation-triangle' : 'info-circle';
    
    notification.innerHTML = `
        <i class="fa-solid fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function deconnecter() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        console.log('👋 Déconnexion');
        // Rediriger vers la page de connexion
        window.location.href = 'connexion.html';
        // alert('Déconnexion réussie');
    }
}