<?php
header("Access-Control-Allow-Origin: https://www.cartecdevenezuela.com/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
$propDoc = isset($_COOKIE['propDoc']) ? $_COOKIE['propDoc'] : "";
$data = json_decode(file_get_contents("php://input"));
$jwt = isset($data->jwt) ? $data->jwt : "";
$codEd = isset($data->codEd) ? $data->codEd : "";
$codigoProp = isset($data->codigoProp) ? $data->codigoProp : "";
$saiAsig = isset($data->saiAsig) ? $data->saiAsig : "";
$nombre = isset($data->Nombre) ? $data->Nombre : "";
$apellido = isset($data->Apellido) ? $data->Apellido : "";
$rif = isset($data->cuenta_propietario) ? $data->cuenta_propietario : "";
$correo = isset($data->Correo) ? $data->Correo : "";

switch($saiAsig){
	case 'deladm':
		if($codEd=='' || $nombre=='' || $apellido == '' || $rif == '' || $correo == '' || $codigoProp == ''){
			$compParam = false;
		}else{
			$compParam = true;
		}	
		break;
}
?>