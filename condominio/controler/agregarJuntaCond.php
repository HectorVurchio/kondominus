<?php
if($adminPermission && $compParam){
	$database = new Database();
	$db = $database->getConnection();
	$juntacond = new GeneralObject($db);
	$consultaUno = 'SELECT DISTINCT periodo FROM junta_de_condominio WHERE cod_edificio = :coe ORDER BY inicio DESC LIMIT 1';
	$arrParamUno = [':coe'=>$cod_edificio];
	if($juntacond->selectDataThree($consultaUno,$arrParamUno)){
		$reg = $juntacond->getRegistros();
		$nuePer = intval($reg['periodo'])+1;
		$preconsUno = "INSERT INTO junta_de_condominio(cod_edificio,cargo,unidad,representante,periodo,duracion,inicio,numero_acceso)VALUES ";
		$preconDos = '';
		for($i=0;$i<count($junta);$i++){
			$preconDos .= "(:coe${i},:car${i},:uni${i},:rep${i},:per${i},:dur${i},:ini${i},:nua${i})";
			if($i == count($junta)-1){$preconDos .=';';}else{$preconDos .=',';}
			$arrParam[":coe${i}"] = $cod_edificio;
			$arrParam[":car${i}"] = $junta[$i]->cargo;
			$arrParam[":uni${i}"] = $junta[$i]->unidad;
			$arrParam[":rep${i}"] = $junta[$i]->rif;
			$arrParam[":per${i}"] = $nuePer;
			$arrParam[":dur${i}"] = $periodo->duracion;
			$arrParam[":ini${i}"] = $periodo->inicio;
			$arrParam[":nua${i}"] = $numero_aceso;	
		}
		$consulta = $preconsUno.$preconDos;
		$arrQuery[0][0] = $consulta;
		$arrQuery[0][1] = $arrParam;
		if($juntacond->dataTransactionInsert($arrQuery)){
				http_response_code(200);
				echo json_encode(array("message" =>"Success",
									"response"=>"Registro Exitoso"));
		}else{
				http_response_code(400); //The requested resource could not be found.
				echo json_encode(array("message" =>"El Recurso No Fue Ejecutado En El Segundo Nivel",
									"response"=>$juntacond->getInfoError()));
		}
	}else{
		http_response_code(401); //The requested resource could not be found.
		echo json_encode(array("message" =>"El Recurso No Fue Ejecutado En El Primer Nivel",
									"response"=>$juntacond->getInfoError()));
	}
}else{
	echo json_encode("Fallo Uno");
	http_response_code(500);
}	
?>