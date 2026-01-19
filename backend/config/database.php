<?php
declare(strict_types=1);

$dsn = "mysql:host=localhost;dbname=boutique_uiya;charset=utf8mb4";
$user = "root";
$password = "";

try {
    $cbd = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    die("Erreur connexion DB : " . $e->getMessage());
}
