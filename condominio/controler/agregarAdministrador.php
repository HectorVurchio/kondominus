<?php
if($adminPermission && $compParam){
	$database = new Database();
	$db = $database->getConnection();
	$propietarios = new GeneralObject($db);
	/* 1. check current administrator does exist */
	$consulta = "SELECT cuenta_propietario FROM propietarios WHERE cod_edificio = :coe AND cuenta_propietario = :cpr AND unidad = 'ADMIN' LIMIT 0,1";
	$arrParam=[':coe'=>$codEd,':cpr'=>$rif];
	if($propietarios->selectDataOne($consulta,$arrParam)){
		if($propietarios->getNumRegistros() == 0){
			$consulta = "SELECT cod_propietario FROM propietarios WHERE cod_edificio = :coe AND unidad = 'ADMIN'";
			$arrParam=[':coe'=>$codEd];
			if ($propietarios->selectDataOne($consulta,$arrParam)){
				$administ = $propietarios->getRegistros();
				$i=0;
				foreach ($administ as $value) {
					$adm = explode('-',$value['cod_propietario']);
					$admNum[$i] = $adm[3];
					$i++;
				}
				$max = max($admNum);
				$resultDos = (int)$max + 1;
				$nueCodProp = $codEd.'-'.'ADMIN-'.$resultDos;
				$consulta = "INSERT INTO propietarios SET cod_propietario = :copr, cod_edificio = :coe, ".
					"cuenta_propietario = :cpr, unidad = 'ADMIN', alicuota = 1, saldo = 0, numero_acceso = :nuac";
				$arrParam=[':copr'=>$nueCodProp,':coe'=>$codEd,':cpr'=>$rif,':nuac'=>$numero_aceso];
				if($propietarios->insertDataOne($consulta,$arrParam)){
					$result = "Operacion Exitosa";
					$error = $propietarios->getInfoError();
					echo json_encode(array('result'=>$result,'error'=>$error));
					http_response_code(200);
				}else{
					$result = 'No Insertion';
					$error = $propietarios->getInfoError();
					echo json_encode(array('result'=>$result,'error'=>$error));
					http_response_code(401);
				}
			}else{
				$result = 'No Selection 2';
				$error = $propietarios->getInfoError();
				echo json_encode(array('result'=>$result,'error'=>$error));
				http_response_code(401);
			}
			
		}else{
			$result = 'Manager Existence';
			$error = $propietarios->getInfoError();
			echo json_encode(array('result'=>$result,'error'=>$error));
			http_response_code(401);
		}
	}else{
		$result = 'No Selection 1';
		$error = $propietarios->getInfoError();
		echo json_encode(array('result'=>$result,'error'=>$error));
		http_response_code(401);
	}
}else{
	echo json_encode("Fallo Uno");
	http_response_code(500);
}	
?>