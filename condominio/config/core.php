<?php
// Reporte De Errores
error_reporting(E_ALL);
 
// inicio de sesion php

 
// seteo del time-zone por defecto
date_default_timezone_set('America/Caracas');
 
// url de la pagina principal
$home_url="https://localhost/";

// variables used for jwt (JWT claims)
$key = "miPassword"; //secret key
$iss = "http://localhost"; //issuer claim this can be the server name
$aud = "http://example.com"; //audience claim
$iat = 1356999524;  //issue date claim
$nbf = 1357000000; // not before claim
 
//pagina dada en parametro URL, la pagina por defecto es 1
$page = isset($_GET['page']) ? $_GET['page'] : 1;
 
// seteo del numero de registros por pagina
$records_per_page = 5;
 
// calculo para la clausula query LIMIT 
$from_record_num = ($records_per_page * $page) - $records_per_page;
?>