<?php
require __DIR__ . '/../../config/database.php';
session_start();

/* =========================
   SÉCURITÉ
========================= */
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit('Non autorisé');
}

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
if (!$id) {
    http_response_code(400);
    exit('Produit invalide');
}

/* =========================
   VALIDATION DES DONNÉES
========================= */
$nom           = trim($_POST['nom'] ?? '');
$description   = trim($_POST['description'] ?? '');
$categorie_id  = (int) ($_POST['categorie_id'] ?? 0);
$prix_unitaire = (float) ($_POST['prix_unitaire'] ?? 0);
$prix_achat    = (float) ($_POST['prix_achat'] ?? 0);
$seuil_alerte  = (int) ($_POST['seuil_alerte'] ?? 0);
$unite_mesure  = trim($_POST['unite_mesure'] ?? '');
$statut        = $_POST['statut'] ?? 'actif';
$date_peremption = $_POST['date_peremption'] ?: null;
$fournisseur   = trim($_POST['fournisseur'] ?? '');

if (
    $nom === '' ||
    $categorie_id <= 0 ||
    $prix_unitaire <= 0
) {
    http_response_code(422);
    exit('Données invalides');
}

/* =========================
   UPDATE
========================= */
$stmt = $db->prepare("
    UPDATE produits SET
        nom = :nom,
        description = :description,
        categorie_id = :categorie_id,
        prix_unitaire = :prix_unitaire,
        prix_achat = :prix_achat,
        seuil_alerte = :seuil_alerte,
        unite_mesure = :unite_mesure,
        statut = :statut,
        date_peremption = :date_peremption,
        fournisseur = :fournisseur,
        date_modification = NOW()
    WHERE id = :id
");

$stmt->execute([
    ':nom' => $nom,
    ':description' => $description,
    ':categorie_id' => $categorie_id,
    ':prix_unitaire' => $prix_unitaire,
    ':prix_achat' => $prix_achat,
    ':seuil_alerte' => $seuil_alerte,
    ':unite_mesure' => $unite_mesure,
    ':statut' => $statut,
    ':date_peremption' => $date_peremption,
    ':fournisseur' => $fournisseur,
    ':id' => $id
]);

exit('Produit modifié avec succès');
