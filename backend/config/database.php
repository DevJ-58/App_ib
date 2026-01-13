<?php 
$dsn = "mysql:host=localhost;dbname=boutique_uiya";

$user = 'root';
$password = '';


$cbd = new PDO($dsn,$user,$password);

if(!$cbd){
    echo 'Connexion echoue';

}else{
    //echo 'connexion reussi';
    }


?>