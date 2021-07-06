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
$condicion = isset($data->condicion) ? $data->condicion : "";
$control = isset($data->control) ? $data->control : "";
$ctasAPagar = isset($data->cap) ? $data->cap : "";
$email = isset($data->email) ? $data->email : "";
$jwt = isset($data->jwt) ? $data->jwt : "";
$monto = isset($data->total) ? $data->total : "";
$password = isset($data->password) ? $data->password : "";
$saiAsig = isset($data->saiAsig) ? $data->saiAsig : "";
$tipoPago = isset($data->pago) ? $data->pago : "";
$referencia = isset($data->referencia) ? $data->referencia : "";
$inmueble = isset($data->inmueble) ? $data->inmueble : "";
$compParam = false;
$llave = 'sinllave';


switch($saiAsig){
	case 'reporpag':
		if($codEd=='' || $monto == '' || $tipoPago == '' || $referencia == '' || $inmueble == ''){
			$compParam = false;
		}else{
			$llave = 'registro';
			$compParam = true;
		}
	break;
	case 'AccRej':
		if($codEd=='' || $email=='' || $password=='' || $control=='' || $inmueble == '' || $monto == '' || $condicion == ''){
			$compParam = false;
		}else{
			$llave = 'confirma';
			$compParam = true;
		}
	break;
	case 'ctacobpag':
		if($codEd=='' || $inmueble == '' || $ctasAPagar == ''){
			$compParam = false;
		}else{
			$llave = 'reporta';
			$compParam = true;
		}
	break;
}

?>