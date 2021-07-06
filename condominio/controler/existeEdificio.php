<?php
if($jwt != ''){
	$database = new Database();
	$db = $database->getConnection();
	if($db != null){
		if($rif!=""){
			$general = new GeneralObject($db);
			$consulta = "SELECT id_ed, nombre_edificio, direccion,estado,ciudad,telefono,correo FROM edificios ".  
						"INNER JOIN estados ON edificios.id_estado = estados.id_estado ".
						"INNER JOIN bd_pref_tel_ciudad ON edificios.id_ciudad = bd_pref_tel_ciudad.id_ciudad ".
						" WHERE cod_edificio = :coe LIMIT 0,1";
			$arrParam=[':coe'=>$rif];
			if($general->selectDataThree($consulta,$arrParam)){
				$datosEdificio = $general->getRegistros();
				if($general->getNumRegistros()>0){
					$numReg = "Presente";
				}else{
					$numReg = "Ausente";
				}
				http_response_code(200); //Success
				echo json_encode(array("message" =>"Success",
									"response"=>$datosEdificio,
									"numReg" => $numReg));	
			}else{
				$datosEdificio = $general->getInfoError();
				http_response_code(400); //The requested resource could not be found.
				echo json_encode(array("message" =>"Failed",
									"response"=>$datosEdificio,
									"numReg" => "Fallo 0"));
			}
		}else{
			http_response_code(404); //Bad Request
			echo json_encode(array("message" =>"Bad Request",
									"response"=>"NO Hubo Parámetros",
									"numReg" => "Fallo 1"));
		}
	}else{
		http_response_code(403); //Internal Error
		echo json_encode(array("message" =>"Internal Error",
									"response"=>"NO Hubo Comunicación",
									"numReg" => "Fallo 2"));
	}
}else{
	http_response_code(403); //Authorization Failed
	echo json_encode(array("message" =>"Authorization Failed",
									"response"=>"NO Posee Permisos",
									"numReg" => "Fallo 3"));
}

?>