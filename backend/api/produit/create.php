<?php
declare(strict_types=1);

session_start();


require __DIR__ . '/../../config/database.php';

/* =========================
   SÉCURITÉ HTTP
========================= */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Méthode non autorisée');
}

/* =========================
   RÉCUPÉRATION DES DONNÉES
========================= */
$data = [
    'code_barre' => isset($_POST['code_barre']) && $_POST['code_barre'] !== ''
        ? trim($_POST['code_barre'])
        : null,

    'nom' => trim($_POST['nom'] ?? ''),

    'description' => isset($_POST['description']) && $_POST['description'] !== ''
        ? trim($_POST['description'])
        : null,

    'categorie_id' => (int) ($_POST['categorie_id'] ?? 0),

    'prix_unitaire' => (float) ($_POST['prix_unitaire'] ?? 0),

    'prix_achat' => (float) ($_POST['prix_achat'] ?? 0),

    'stock_actuel' => (int) ($_POST['stock_actuel'] ?? 0),

    'seuil_alerte' => (int) ($_POST['seuil_alerte'] ?? 0),

    'unite_mesure' => isset($_POST['unite_mesure']) && $_POST['unite_mesure'] !== ''
        ? trim($_POST['unite_mesure'])
        : null,

    'statut' => $_POST['statut'] ?? 'actif',

    'date_peremption' => $_POST['date_peremption'] ?? null,

    'fournisseur' => isset($_POST['fournisseur']) && $_POST['fournisseur'] !== ''
        ? trim($_POST['fournisseur'])
        : null,
];

/* =========================
   VALIDATION
========================= */
if (
    $data['nom'] === '' ||
    $data['categorie_id'] <= 0 ||
    $data['prix_unitaire'] <= 0
) {
    http_response_code(400);
    exit('Données invalides');
}

/* =========================
   UNICITÉ CODE BARRE
========================= */
if ($data['code_barre'] !== null) {
    $check = $cbd->prepare(
        "SELECT id FROM produits WHERE code_barre = ? LIMIT 1"
    );
    $check->execute([$data['code_barre']]);

    if ($check->fetch()) {
        http_response_code(409);
        exit('Code barre déjà utilisé');
    }
}

/* =========================
   INSERTION
========================= */
$now = date('Y-m-d H:i:s');
$userId = $_SESSION['user_id'] ?? 1; // temporaire

$stmt = $cbd->prepare("
    INSERT INTO produits (
        code_barre,
        nom,
        description,
        categorie_id,
        prix_unitaire,
        prix_achat,
        stock_actuel,
        seuil_alerte,
        unite_mesure,
        image_url,
        statut,
        date_peremption,
        fournisseur,
        date_creation,
        date_modification,
        utilisateur_creation_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

try {
    $stmt->execute([
        $data['code_barre'],
        $data['nom'],
        $data['description'],
        $data['categorie_id'],
        $data['prix_unitaire'],
        $data['prix_achat'],
        $data['stock_actuel'],
        $data['seuil_alerte'],
        $data['unite_mesure'],
        null,
        $data['statut'],
        $data['date_peremption'],
        $data['fournisseur'],
        $now,
        $now,
        $userId
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    exit('Erreur SQL : ' . $e->getMessage());
}
header('Location: /App_ib/frontend/HTML/dashbord.php'); 
exit;

/* =========================
   RÉPONSE
========================= */
//http_response_code(201);
//echo 'INSERT OK';
//exit;
?>  