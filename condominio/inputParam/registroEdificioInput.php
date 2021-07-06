<?php
header("Access-Control-Allow-Origin: https://www.cartecdevenezuela.com/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));
$jwt = isset($data[0]->jwt) ? $data[0]->jwt : "";

$propietarios = [];
$ctas_por_cobrar = [];
$edificios['cod_edificio'] = isset($data[0]->rif) ? $data[0]->rif : "";
$edificios['nombre_edificio'] = isset($data[0]->proveedor) ? $data[0]->proveedor : "";
$edificios['direccion'] = isset($data[0]->direc) ? $data[0]->direc : "";
$edificios['id_estado'] = isset($data[0]->estado) ? $data[0]->estado : "";
$edificios['id_ciudad'] = isset($data[0]->ciudad) ? $data[0]->ciudad : "";
$edificios['telefono'] = isset($data[0]->telef) ? $data[0]->telef : "";
$edificios['correo'] = isset($data[0]->email) ? $data[0]->email : "";
$dinero['dineroBan'] = isset($data[1]->dineroBan) ? $data[1]->dineroBan : "";
$dinero['dineroEfec'] = isset($data[1]->dineroEfec) ? $data[1]->dineroEfec : "";
$dinero['fondoR'] = isset($data[1]->fondoR) ? $data[1]->fondoR : "";
$dinero['ctappag'] = isset($data[1]->ctappag) ? $data[1]->ctappag : "";
$dinero['ctappro'] = isset($data[1]->ctappro) ? $data[1]->ctappro : "";

$cargoCond = [];
if($edificios['cod_edificio'] == '' || $edificios['nombre_edificio'] == '' || $edificios['direccion'] == '' || 
	$edificios['id_estado'] == '' || $edificios['id_ciudad'] == '' || $edificios['telefono'] == '' ||
	$edificios['correo'] == '' ){
	$compParam = false;
}elseif(count($data)<4){
	$compParam = false;
}else{
	foreach($data[2] as $key => $value){
		$clave = explode('-',$key);
		if($clave[0] == 'cargo'){
			$cargoCond[intval($clave[1])] = $value;
		}else{
			$duracion = intval($value);
		}
	}
	$compParam = true;
}

if(count($data)>4){
	$tope = count($data)-2;
	for($i = 1;$i<$tope;$i++){
		$unit = 'unidad'.$i;
		$rl = 'rifLetra'.$i;
		$ri = 'rif'.$i;
		$al = 'alic'.$i;
		$deu = 'deuda'.$i;
		$ind = $i+2;
		$propietarios[$i]['cod_propietario'] = $data[0]->rif.'-'.$data[$ind]->$unit;
		$propietarios[$i]['codigo_edificio'] = $data[0]->rif;
		$propietarios[$i]['cuenta_propietario'] = $data[$ind]->$rl.$data[$ind]->$ri;
		$propietarios[$i]['unidad'] = $data[$ind]->$unit;
		$propietarios[$i]['alicuota'] = $data[$ind]->$al;
		$ctas_por_cobrar[$i]['unidad'] = $data[$ind]->$unit;
		$ctas_por_cobrar[$i]['cod_edificio'] = $data[0]->rif;
		$ctas_por_cobrar[$i]['monto'] = $data[$ind]->$deu;
	}
}
?>
