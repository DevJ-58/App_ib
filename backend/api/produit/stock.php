<?php
require __DIR__ . '/../../config/database.php';
session_start();

$id = (int) $_POST['produit_id'];
$qte = (int) $_POST['quantite'];
$type = $_POST['type']; // entree | sortie

if ($qte <= 0) exit('Quantité invalide');

$stmt = $cbd->prepare("SELECT stock_actuel FROM produits WHERE id = ?");
$stmt->execute([$id]);
$produit = $stmt->fetch();

if (!$produit) exit('Produit introuvable');

$newStock = $type === 'entree'
    ? $produit['stock_actuel'] + $qte
    : $produit['stock_actuel'] - $qte;

if ($newStock < 0) exit('Stock insuffisant');

$update = $cbd->prepare("
UPDATE produits SET stock_actuel = ?, date_modification = ?
WHERE id = ?
");

$update->execute([$newStock, date('Y-m-d H:i:s'), $id]);

exit('Stock mis à jour');
