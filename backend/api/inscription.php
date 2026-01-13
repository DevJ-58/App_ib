<?php
require '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit;
}

$nom    = trim($_POST['nom'] ?? '');
$prenom = trim($_POST['prenom'] ?? '');
$numero = trim($_POST['numero_telephone'] ?? '');
$email  = trim($_POST['email'] ?? '');
$mdp    = $_POST['mot_de_passe'] ?? '';
$confirm= $_POST['confirm_password'] ?? '';
$photo  = $_POST['photo_profil'] ?? null;
$now    = date('Y-m-d H:i:s');

/* Champs obligatoires */
if (!$nom || !$prenom || !$numero || !$email || !$mdp || !$confirm) {
    header("Location: /APP_IB/frontend/HTML/inscription.html?error=empty");
    exit;
}

/* Mot de passe */
if ($mdp !== $confirm) {
    header("Location: /APP_IB/frontend/HTML/inscription.html?error=password");
    exit;
}

/* Vérifier unicité */
$check = $cbd->prepare(
    "SELECT id FROM utilisateurs WHERE numero_telephone = ? OR email = ?"
);
$check->execute([$numero, $email]);

if ($check->rowCount() > 0) {
    header("Location: /APP_IB/frontend/HTML/inscription.html?error=exist");
    exit;
}

/* Hash */
$mot_de_passe = password_hash($mdp, PASSWORD_DEFAULT);

/* Insert */
$insert = $cbd->prepare("
    INSERT INTO utilisateurs
    (nom, prenom, numero_telephone, email, mot_de_passe, photo_profil, date_creation, date_modification)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");

$insert->execute([
    $nom, $prenom, $numero, $email,
    $mot_de_passe, $photo, $now, $now
]);

/* ✅ Redirection finale */
header("Location: /App_ib/frontend/HTML/connexion.html?success=1");
exit;
