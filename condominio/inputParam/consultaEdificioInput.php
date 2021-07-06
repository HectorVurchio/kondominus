<?php
header("Access-Control-Allow-Origin: https://www.cartecdevenezuela.com/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
$propDoc = isset($_COOKIE['propDoc']) ? $_COOKIE['propDoc'] : "";
$data = json_decode(file_get_contents("php://input"));
/* Variables */
$actividad=isset($data->actividad) ? $data->actividad : "";
$banco = isset($data->banco) ? $data->banco : "";
$baseImp=isset($data->baseImp) ? $data->baseImp : "";
$ciudad=isset($data->ciudad) ? $data->ciudad : "";
$codEd = isset($data->codEd) ? $data->codEd : "";
$codigoProp = isset($data->codProp) ? $data->codProp : "";
$concepto=isset($data->concepto) ? ucwords(strtolower($data->concepto)) : ""; 
$contacto=isset($data->conta) ? $data->conta : "";
$correo=isset($data->email) ? $data->email : "";
$direccion=isset($data->direc) ? $data->direc : ""; 
$estado=isset($data->estado) ? $data->estado : "";
$excento=isset($data->excento) ? $data->excento : ""; 	
$factura=isset($data->factura) ? $data->factura : ""; //numero de factura
$falta = isset($data->falta) ? $data->falta : ""; //complemento provision
$fecha=isset($data->fecha) ? $data->fecha : ""; 
$formaPago = isset($data->formaPago) ? $data->formaPago : ""; // cuenta a debitar
$formaPagoDos = isset($data->formaPagoDos) ? $data->formaPagoDos : ""; /* para pagos combinados*/
$formular = isset($data->formular) ? $data->formular : ""; // formulario  de origen
$interes = isset($data->interes) ? $data->interes : "";
$iva=isset($data->iva) ? $data->iva : ""; 	
$jwt = isset($data->jwt) ? $data->jwt : "";
$multa = isset($data->multa) ? $data->multa : "";
$nombre=isset($data->proveedor) ? ucwords(strtolower($data->proveedor)) : "";
$nota = isset($data->notas) ? $data->notas : "";
$operacion = isset($data->operacion) ? $data->operacion : "";  /* para pagos combinados*/
$provcont = isset($data->provcont) ? $data->provcont : ""; //control previsiones
$referencia=isset($data->referencia) ? $data->referencia : ""; //referencia del deposito o tranferencia
$rif=isset($data->rif) ? $data->rif : "";
$saiAsig = isset($data->saiAsig) ? $data->saiAsig : "";
$telefono=isset($data->telef) ? $data->telef : "";
$tipoComision = isset($data->tipoComision) ? $data->tipoComision : "";
$tipoGasto = isset($data->tipoGasto) ? $data->tipoGasto : ""; //tipo de gasto
$total=isset($data->total) ? $data->total : ""; //monto total
$usadoProv = isset($data->usadoProv) ? $data->usadoProv : ""; //monto usado por la prevision
$vencimiento = isset($data->vencimiento) ? $data->vencimiento : "";


$compParam = false;

switch($saiAsig){
	case 'infoEdif':
		if($codEd==''){$compParam = false;}else{$compParam = true;}
		break;
	case 'rifverif':
	case 'cedverif':
		if($rif=='' || $codEd==''){$compParam = false;}else{$compParam = true;}
		break;
	case 'ingrefac':
		if($rif == '' || $nombre == '' || $fecha == '' || $factura == '' || $concepto == '' || 
			$excento == '' || $iva == '' || $baseImp == '' || $total == '' || $formaPago == '' ||
			$referencia == '' || $codEd == '' || $tipoGasto == ''){$compParam = false;}else{$compParam = true;}
		break;
	case 'regPro':
		if($rif=='' || $codEd=='' || $nombre=='' || $direccion=='' || $telefono=='' || 
		   $contacto=='' || $correo=='' || $estado=='' || $ciudad=='' || $actividad==''){
			$compParam = false;
		}else{
			$compParam = true;
		}
		break;
	case 'ingrerec':
			if($rif=='' || $nombre=='' || $fecha=='' || $concepto=='' || $total=='' || $referencia=='' || 
			   $nota=='' || $tipoGasto=='' || $formaPago==''){
				   $compParam = false;
			}else{
				$compParam = true;
			} 
		break;
	case 'regemp':
		if($rif=='' || $codEd=='' || $nombre=='' || $direccion=='' || $telefono=='' || 
		   $total=='' || $correo=='' || $estado=='' || $ciudad=='' || $actividad==''){  
			$compParam = false;
		}else{
			$compParam = true;
		}
		break;
	case 'ingrenom':
		if($rif=='' || $codEd=='' || $nombre=='' || $fecha=='' || $concepto=='' || 
		$total=='' || $referencia=='' || $nota=='' || $formaPago==''){  
			$compParam = false;
		}else{
			$compParam = true;
		}	
		break;
	case 'ingrecom':
		if($codEd=='' || $banco=='' || $fecha=='' || $total=='' || $formaPago=='' || $nota=='' || $referencia=='' || $tipoComision == ''){
			$compParam = false;
		}else{
			$compParam = true;
			$tipoGasto = $tipoComision;
		}	
		break;
	case 'ingreadm':
		if($codEd=='' || $rif=='' || $codigoProp==''){
			$compParam = false;
		}else{
			$compParam = true;
		}	
		break;
	case 'multaEint':
		if($codEd=='' || $interes=='' || $multa==''){
			$compParam = false;
		}else{
			$compParam = true;
		}	
		break;
	case 'ingrecred':
		if($codEd=='' || $tipoGasto=='' || $fecha=='' || $rif=='' || $total == '' || $concepto=='' || $nota=='' || $vencimiento=='' || $formaPago==''){
			$compParam = false;
		}else{
			$compParam = true;
		}	
		break;
	case 'consegre':
		if($codEd=='' || $tipoGasto==''){
			$compParam = false;
		}else{
			$compParam = true;
		}	

		break;
}
?>