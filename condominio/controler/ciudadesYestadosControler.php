<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Access-Control-Allow-Headers, Authorization, X-Requested-With");
/*Objetos En Caso Se No Encontrarse Datos*/
function createObject($arrKey){
	$nomVar = new stdClass;
	foreach($arrKey as $key => $value){
		$nomVar->$value = 'none';
	}
	return $nomVar;
}

function retrieve($obj,$consulta,$arrPar){
	if($obj->selectDataTwo($consulta)){
		if($obj->getNumRegistros()>0){
			$searRS = $obj->getRegistros();
		}else{
			$empResSet = createObject($arrPar);
			$searRS = array($empResSet);
		}	
	}else{
		$empResSet = createObject($arrPar);
		$searRS = array($empResSet);
	}
	return $searRS;
}
/* Hasta Aqui Los Objetos*/

	$database = new Database();
	$db = $database->getConnection();
	if($database->conn == null){
		http_response_code(500);
		echo json_encode(array("message" =>"Hubo Un Problema",
									"resultado"=>"No Hubo Conexión Con La Base De Datos",
									"telefonos"=>"No Hubo Conexión Con La Base De Datos"));
	}else{
		$general = new GeneralObject($db);
		$consulta = "SELECT id_estado,estado FROM estados";
		$arrPar = ['id_estado','estado'];
		$estadosVzla = retrieve($general,$consulta,$arrPar);

		$consulta = "SELECT id_ciudad,id_estado,id_pref_ciudad,ciudad,prefijo_telefonico FROM bd_pref_tel_ciudad";
		$arrPar = ['id_pref_ciudad','ciudad','prefijo_telefonico','id_ciudad','id_estado'];
		$telefVzla = retrieve($general,$consulta,$arrPar);

		$consulta = "SELECT cod_cta,grupo,tipo_cta,nombre_cta,mod_emi,forma FROM cuentas_contabilidad";
		$arrPar = ['id_cta','cod_cta','grupo','tipo_cta','nombre_cta','mod_emi','forma'];
		$contabilidad = retrieve($general,$consulta,$arrPar);
		
		$consulta = "SELECT cod_clasif, clasificacion FROM clasif_proyec";
		$arrPar = ['cod_clasif','clasificacion'];
		$proyec = retrieve($general,$consulta,$arrPar);

		$consulta = "SELECT actividad As aAct,cod_act AS bCod, id_ac AS cID FROM actividades_economicas";
		$arrPar = ['id_ac','cod_act','actividad'];
		$actividades = retrieve($general,$consulta,$arrPar);
		
		$consulta = "SELECT id,cod_banco,nombre_banco FROM entidades_bancarias";
		$arrPar = ['id','cod_banco','nombre_banco'];
		$bancos = retrieve($general,$consulta,$arrPar);

		echo json_encode(array("resultado"=>$estadosVzla,
			"telefonos"=>$telefVzla,
			"contabilidad"=>$contabilidad,
			"proyecciones"=>$proyec,
			"actividades"=>$actividades,
			"ent_bancaria"=>$bancos));
			http_response_code(200);
			
	}

?>