<?php
session_start();
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Vérification des champs
    if (!isset($_POST['number_user'], $_POST['password_user'])) {
        header("Location: /App_ib/frontend/HTML/connexion.html?error=champs");
        exit;
    }

    $numero = $_POST['number_user'];
    $mot_de_passe = $_POST['password_user'];

    // Requête utilisateur
    $query = $cbd->prepare("SELECT * FROM utilisateurs WHERE numero_telephone = ?");
    $query->execute([$numero]);

    if ($query->rowCount() === 0) {
        header("Location: /App_ib/frontend/HTML/connexion.html?error=numero");
        exit;
    }

    $user = $query->fetch(PDO::FETCH_ASSOC);

    if (!password_verify($mot_de_passe, $user['mot_de_passe'])) {
        header("Location: /App_ib/frontend/HTML/connexion.html?error=mot_de_passe");
        exit;
    }

    // Stockage de l'utilisateur en session
    $_SESSION['user'] = $user;

    // Redirection vers le dashboard
    header("Location: /App_ib/frontend/HTML/dashbord.php");
    exit;
}
