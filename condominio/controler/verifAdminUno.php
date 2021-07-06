
<?php
$user = new UserInfo(); 
$OSenUso = $user->get_os();
$dirIPenUso = $user->get_ip();
$navEnUso = $user->get_browser();
$dispEnUso = $user->get_device();
$horaActual = date("Y-m-d H:i:s");
$propDoc = isset($_COOKIE['propDoc']) ? $_COOKIE['propDoc'] : "";
if($propDoc != ""){
	$propDocDos = explode(',',$propDoc);
	$nombEdificio = $propDocDos[0];
	$numEdificio = $propDocDos[2];
	$numPropietario = $propDocDos[1];
	$unidad = $propDocDos[3];
	$estatus = $propDocDos[4];
	$numero_aceso = $propDocDos[5];
	$database = new Database();
	$db = $database->getConnection();
	if($db != null){
		$controlAcceso = new ControlAccesosObject($db);
		$controlAcceso->setNumeroAcceso($numero_aceso);	
		if($controlAcceso->ControlDeAcceso()){
			$registro = $controlAcceso->getRegistro();
			$idEgistro = $registro['id'];
			$cedula = $registro['cedula'];
			$codPropiet = $registro['cod_propietario'];
			$dirIP = $registro['dir_IP'];
			$sistOp = $registro['sist_oper'];
			$navegador = $registro['navegador'];
			$dispositivo = $registro['dispositivo'];
			$fechaHora = $registro['fecha_hora'];
			$estatus = $registro['estatus'];
			$propietario = new PropietariosObject($db); 
			$propietario->setCodigoPropietario($codPropiet);
			if($propietario->consultaAdministrador()){
				$cedAdministrador = $propietario->getCtaPropietario();
				$cedAdm = $cedAdministrador['cuenta_propietario'];	
			}else{
				$cedAdministrador = $propietario->generaString(9);
				$cedAdm = $propietario->generaString(6);
			}
			$codProSpted = explode('-',$codPropiet);
			$codEdif = $codProSpted[0].$codProSpted[1];
			$privilege = $codProSpted[2];
			$dateTime1 = new DateTime($fechaHora);
			$dateTime2 = new DateTime($horaActual);
			$interval = $dateTime1->diff($dateTime2);
			$difAnos = $interval->y;
			$difMeses = $interval->m;
			$difDias = $interval->d;
			$difHoras = $interval->h;
			$difMin = $interval->i;			
			$totalMin = (((($difAnos*12)+$difMeses)*30+$difDias)*24+$difHoras)*60+$difMin;
						
			if($totalMin<180  && $cedula == $cedAdm && $dirIPenUso == $dirIP && $estatus == 1){
				if($privilege == 'ADMIN'){
					$adminPermission = true;
					$normalPermission = false;
				}else{
					$adminPermission = false;
					$normalPermission = true;
				}
				$nuevo = false;
			}else{
				$adminPermission = false;
				$normalPermission = false;
				if($numEdificio == 'J-000000000' && $unidad == 'N0' && $totalMin<180 && $estatus == 1){
					$nuevo = true;
				}else{
					$nuevo = false;
					//setear en control de accesos estatus 0 
					$controlAcceso->setNumeroAcceso($numero_aceso);
					$controlAcceso->cambiarEstatusCero();
				}	
			}
		}else{
			$adminPermission = false;
			$normalPermission = false;
			$nuevo = false;
		}
	}else{
			$adminPermission = false;
			$normalPermission = false;
	}
	
}else{
			$adminPermission = false;
			$normalPermission = false;
	
}

?>