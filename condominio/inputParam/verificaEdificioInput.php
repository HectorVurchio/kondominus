<?php
header("Access-Control-Allow-Origin: https://www.cartecdevenezuela.com/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
$propDoc = isset($_COOKIE['propDoc']) ? $_COOKIE['propDoc'] : "";
$data = json_decode(file_get_contents("php://input"));
$rif = $data->rif;
$jwt = $data->jwt;
?>