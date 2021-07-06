<?php
if($adminPermission && $compParam){
	$database = new Database();
	$db = $database->getConnection();
	if($db != null){
		$general = new GeneralObject($db);
		switch($formular){
			case 'facturas_resumen':
				$consulta = "SELECT LPAD(control,4,0) AS Numero,DATE_FORMAT(fecha,'%d %m %Y') AS Fecha,proveedores.nombre as Proveedor,concepto AS Concepto,TRUNCATE(monto,2) AS Monto FROM facturas_egresos INNER JOIN proveedores ON facturas_egresos.rif = proveedores.rif WHERE facturas_egresos.cod_edificio = :coe AND status = :st AND tipo_gasto = :tiga";													 
				break;
			case 'recibos_resumen':
				$consulta = "SELECT LPAD(control,4,0) AS Numero,DATE_FORMAT(fecha,'%d %m %Y') AS Fecha,proveedores.nombre as Proveedor,concepto AS Concepto,TRUNCATE(monto,2) AS Monto FROM recibos_egresos INNER JOIN proveedores ON recibos_egresos.rif = proveedores.rif WHERE recibos_egresos.cod_edificio = :coe AND status = :st AND tipo_gasto = :tiga";
				break;
			case 'nomina_mes':
				$consulta = "SELECT LPAD(control,4,0) AS Numero, DATE_FORMAT(fecha,'%d %m %Y') AS Fecha,empleados.nombre as Nombre,concepto AS Concepto,TRUNCATE(monto,2) AS Monto FROM recibos_egresos_nomina  INNER JOIN empleados ON recibos_egresos_nomina.cedula = empleados.cedula WHERE recibos_egresos_nomina.cod_edificio = :coe AND status = :st AND tipo_gasto = :tiga";
				break;
			case 'comision_banco':
				$consulta = "SELECT LPAD(control,4,0) AS Numero,DATE_FORMAT(fecha,'%d %m %Y') AS Fecha,entidades_bancarias.nombre_banco AS Banco,nota AS Anotacion,TRUNCATE(monto,2) AS Monto FROM comisiones_bancarias INNER JOIN entidades_bancarias ON comisiones_bancarias.banco =  entidades_bancarias.cod_banco WHERE cod_edificio = :coe AND status = :st AND tipo_gasto = :tiga";	
				break;
			case 'cuentas_pagar':
				$consulta = "SELECT LPAD(control,4,0) AS Numero,DATE_FORMAT(fecha,'%d %m %Y') AS Fecha,proveedores.nombre as Proveedor,concepto AS Concepto,TRUNCATE(monto,2) AS Monto FROM cuentas_por_pagar INNER JOIN proveedores ON cuentas_por_pagar.rif = proveedores.rif WHERE cuentas_por_pagar.cod_edificio = :coe AND status = :st AND tipo_gasto = :tiga";	
				break;
			case 'provisiones':
				$consulta = "SELECT LPAD(control,4,0) AS Numero,DATE_FORMAT(fecha,'%d %m %Y') AS Fecha, concepto AS Concepto,TRUNCATE((monto - usado),2) AS Monto FROM provisiones WHERE cod_edificio = :coe AND status = :st AND tipo_gasto = :tiga";
				break;
		}
		$arrParam = [':coe'=>$codEd,':st'=>0,':tiga'=>$tipoGasto];
		if($general->selectDataOne($consulta,$arrParam)){
			http_response_code(200);
			echo json_encode($general->getRegistros());
		}else{
			http_response_code(400);
			echo json_encode($general->getInfoError());
		}
	}else{
		http_response_code(500); //Internal Error
		echo json_encode(array("message" =>"Internal Error",
							   "response"=>"NO Hubo Comunicación"));
	}
}else{
	http_response_code(403); //Authorization Failed
	echo json_encode(array("message" =>"Authorization Failed",
						   "response"=>"NO Posee Permisos"));
}
?>