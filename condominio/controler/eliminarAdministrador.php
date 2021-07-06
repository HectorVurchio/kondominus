<?php
if($adminPermission && $compParam){
	$database = new Database();
	$db = $database->getConnection();
	$propietarios = new GeneralObject($db);

	$consulta = "SELECT id_prop,cuenta_propietario,cod_propietario, usuarios.Nombre, usuarios.Apellido, usuarios.Correo FROM propietarios INNER JOIN usuarios ON propietarios.cuenta_propietario = usuarios.Cedula WHERE unidad = 'ADMIN' AND cod_edificio = :coe";
	$arrParam = [':coe'=>$codEd];
	if($propietarios->selectDataOne($consulta,$arrParam)){
		if($propietarios->getNumRegistros()<2){
			echo json_encode('No se puede eliminar el administrador');
			http_response_code(401);
		}else{
			$consulta = "SELECT id_prop,cuenta_propietario,cod_propietario, usuarios.Nombre, usuarios.Apellido, usuarios.Correo FROM propietarios INNER JOIN usuarios ON propietarios.cuenta_propietario = usuarios.Cedula WHERE unidad = 'ADMIN' AND cod_edificio = :coe AND cuenta_propietario = :cupr";
			$arrParam = [':coe'=>$codEd,':cupr'=>$rif];
			if($propietarios->selectDataThree($consulta,$arrParam)){
				$resSet = $propietarios->getRegistros();
				if($resSet['Nombre'] == $nombre && $resSet['Apellido'] == $apellido && $resSet['Correo'] == $correo){
					$consultaUno = "INSERT INTO propietarios_removidos (cod_propietario,cod_edificio,cuenta_propietario,unidad,alicuota,acceso_anterior,creada_anterior,numero_acceso)(SELECT cod_propietario,cod_edificio,cuenta_propietario,unidad,alicuota,numero_acceso,creada,:nuac FROM propietarios WHERE cod_propietario = :copr AND cuenta_propietario = :cupr)";
					$arrParamUno = [':nuac'=>$numero_aceso,':copr'=>$resSet['cod_propietario'],':cupr'=>$rif];
					$consultaDos = "DELETE FROM propietarios WHERE cod_propietario = :copr AND cuenta_propietario = :cupr";
					$arrParamDos = [':copr'=>$resSet['cod_propietario'],':cupr'=>$rif];
					$arrQue[0][0] = $consultaUno;
					$arrQue[0][1] = $arrParamUno;
					$arrQue[1][0] = $consultaDos;
					$arrQue[1][1] = $arrParamDos;
					if($propietarios->dataTransactionInsert($arrQue)){
						echo json_encode('Operacion Exitosa');
						http_response_code(200);
					}else{
						echo json_encode($propietarios->getInfoError());
						http_response_code(404);
					}
				}else{
					echo json_encode('Los datos no coinciden');
					http_response_code(402);
				}
			}else{
				echo json_encode($propietarios->getInfoError());
				http_response_code(403);
			}	
		}
	}else{
		echo json_encode($propietarios->getInfoError());
		http_response_code(405);
	}
	
}else{
	echo json_encode("Fallo Uno");
	http_response_code(500);
}	
?>