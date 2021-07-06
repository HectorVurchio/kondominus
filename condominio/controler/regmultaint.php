<?php
if($adminPermission && $compParam){
	$database = new Database();
	$db = $database->getConnection();
	if($db != null){
		$general = new GeneralObject($db);
		$consulta = 'SELECT DISTINCT num FROM multas_intereses WHERE cod_edificio = :coe ORDER BY id DESC LIMIT 1';
		$arrParam = [':coe'=>$codEd];
		if($general->selectDataThree($consulta,$arrParam)){
			$reg = $general->getRegistros();
			$nueReg = intval($reg['num'])+1;
			$consulta = "INSERT INTO multas_intereses SET cod_edificio = :coe,fecha = :fec,num = :nu,multa = :mul, interes = :int,numero_acceso = :nuac";
			$arrParam = [':coe'=>$codEd,':fec'=>date("Y-m-d"),':nu'=>$nueReg,':mul'=>$multa,':int'=>$interes,':nuac'=>$numero_aceso];
			if($general->insertDataOne($consulta,$arrParam)){
				echo json_encode('Registro Exitoso');
				http_response_code(200);
			}else{
				echo json_encode('Registro Fallido');
				http_response_code(400);
			}
		}else{
			$reg = $general->getInfoError();
		}
	}else{
		echo json_encode('Fallo En La Conexion');
		http_response_code(500);		
	}
	
}else{
	
}



?>