<?php
header("Access-Control-Allow-Origin: https://www.cartecdevenezuela.com/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
$propDoc = isset($_COOKIE['propDoc']) ? $_COOKIE['propDoc'] : "";
$data = json_decode(file_get_contents("php://input"));
/* Variables */
$codEd = isset($data->codEd) ? $data->codEd : "";
$fecha = isset($data->fecha) ? $data->fecha : "";
$jwt = isset($data->jwt) ? $data->jwt : "";
$piepag =  isset($data->notaPP) ? $data->notaPP : "";
$porcFR = isset($data->aplicFR) ? $data->aplicFR : "";
$porcRec = isset($data->porc) ? $data->porc : "";
$provisiones = isset($data->provisiones) ? $data->provisiones : "";
$saiAsig = isset($data->saiAsig) ? $data->saiAsig : "";
$vence = isset($data->vence) ? $data->vence : "";
$compParam = false;
switch($saiAsig){
	case 'reciboreg':
		if($codEd=='' || $fecha == '' || $porcFR == '' || $porcRec == '' || $vence == ''){
			$compParam = false;
		}else{
			$compParam = true;
		}
	break;
}

?>