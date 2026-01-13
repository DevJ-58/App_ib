<?php
require __DIR__ . '/../../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) exit('Non autorisé');

$id = (int) ($_POST['id'] ?? 0);
if (!$id) exit('Produit invalide');

$stmt = $db->prepare("
UPDATE produits SET
    nom = ?, description = ?, categorie_id = ?,
    prix_unitaire = ?, prix_achat = ?, seuil_alerte = ?,
    unite_mesure = ?, statut = ?, date_peremption = ?,
    fournisseur = ?, date_modification = ?
WHERE id = ?
");

$stmt->execute([
    $_POST['nom'],
    $_POST['description'],
    $_POST['categorie_id'],
    $_POST['prix_unitaire'],
    $_POST['prix_achat'],
    $_POST['seuil_alerte'],
    $_POST['unite_mesure'],
    $_POST['statut'],
    $_POST['date_peremption'],
    $_POST['fournisseur'],
    date('Y-m-d H:i:s'),
    $id
]);

exit('Produit modifié');
