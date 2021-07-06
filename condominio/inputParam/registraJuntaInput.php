<?php
header("Access-Control-Allow-Origin: https://www.cartecdevenezuela.com/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));
$propDoc = isset($_COOKIE['propDoc']) ? $_COOKIE['propDoc'] : "";
$sigue = true;
if(count($data)>1){
	$edificio = $data[0];
	$periodo = $data[1];
	$junta = array();	
}else{
	$sigue = false;
}
if(count($data)>2){
	for($i=2;$i<count($data);$i++){
		$junta[$i-2] = $data[$i];
	}
}else{
	$sigue = false;
}
if($sigue){
	$jwt = isset($edificio->jwt) ? $edificio->jwt : "";
	$cod_edificio = isset($edificio->codEd) ? $edificio->codEd : "";
	$codigoProp = isset($edificio->codProp) ? $edificio->codProp : "";
	$inicio = isset($periodo->inicio) ? $periodo->inicio : "";
	$duracion = isset($periodo->duracion) ? $periodo->duracion : "";
	if($cod_edificio == '' || $inicio == '' || $duracion == ''){
		$compParam = false;
	}else{
		$compParam = true;
	}
}else{
	$compParam = false;
}
?>