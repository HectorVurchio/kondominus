<?php
//USAR SOLO PARA REGISTRAR UN NUEVO EDIFICIO
//salio a partir de verifAdminDos
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
	$numEdificio = $propDocDos[1];
	$numPropietario = $propDocDos[2];
	$unidad = $propDocDos[3];
	$estatus = $propDocDos[4];
	$numero_aceso = $propDocDos[5];
	$database = new Database();
	$db = $database->getConnection();
	if($db != null){
		$general = new GeneralObject($db);
		$consulta =  "SELECT id,cedula,cod_propietario,dir_IP,sist_oper,navegador,dispositivo,fecha_hora,estatus FROM ". 
					"accesos_diarios WHERE numero_acceso = :nua LIMIT 0,1";
		$arrParam=[':nua'=>$numero_aceso];
		if($general->selectDataThree($consulta,$arrParam)){
			$registro = $general->getRegistros();
			$idEgistro = $registro['id'];
			$cedula = $registro['cedula'];
			$codPropiet = $registro['cod_propietario'];
			$dirIP = $registro['dir_IP'];
			$sistOp = $registro['sist_oper'];
			$navegador = $registro['navegador'];
			$dispositivo = $registro['dispositivo'];
			$fechaHora = $registro['fecha_hora'];
			$estatus = $registro['estatus'];
			$dateTime1 = new DateTime($fechaHora);
			$dateTime2 = new DateTime($horaActual);
			$interval = $dateTime1->diff($dateTime2);
			$difAnos = $interval->y;
			$difMeses = $interval->m;
			$difDias = $interval->d;
			$difHoras = $interval->h;
			$difMin = $interval->i;			
			$totalMin = (((($difAnos*12)+$difMeses)*30+$difDias)*24+$difHoras)*60+$difMin;
			if($totalMin<180  &&  $dirIPenUso == $dirIP && $estatus == 1 && $dispEnUso == $dispositivo){
				$normalPermission = true;
			}else{
				$normalPermission = false;
				//setear en control de accesos estatus 0
				$consulta = "UPDATE accesos_diarios SET estatus = '0' WHERE  numero_acceso = :nua";
				$arrParam=[':nua'=>$numero_aceso];
				$general->selectDataThree($consulta,$arrParam);
			}
		}else{
			$normalPermission = false;
		}
	}else{
			$normalPermission = false;
	}
}else{
	$normalPermission = false;
}
?>