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
$control = isset($data->control) ? $data->control : "";
$desde = isset($data->desde) ? $data->desde : "";
$fecha =isset($data->fecha) ? $data->fecha : "";
$hasta = isset($data->hasta) ? $data->hasta : "";
$jwt = isset($data->jwt) ? $data->jwt : "";
$saiAsig = isset($data->saiAsig) ? $data->saiAsig : "";
$compParam = false;
switch($saiAsig){
	case 'gastostotal':
		if($codEd=='' || $fecha == ''){
			$compParam = false;
			$llave = '';
		}else{
			$compParam = true;
			$llave = 'gastostotales';
		}
		break;
	case 'cobrec':
		if($codEd=='' || $fecha == ''){
			$compParam = false;
			$llave = '';
		}else{
			$compParam = true;
			$llave = 'cobrorecibo';
			$stUno = 0;
		}
		break;
	case 'hisrec':
		if($codEd=='' || $desde == '' || $hasta == '' || $control == ''){
			$compParam = false;
			$llave = '';
		}else{
			$compParam = true;
			$llave = 'historicorecibo';
		}	
		break;	
		
	case 'detalrec':
		if($codEd=='' || $fecha == ''){
			$compParam = false;
			$llave = '';
		}else{
			$compParam = true;
			$llave = 'detalles';
		}
		break;
	case 'detalrecviej':
		if($codEd=='' || $control == ''){
			$compParam = false;
			$llave = '';
		}else{
			$compParam = true;
			$llave = 'historicoresumen';
		}
	break;
}
?>