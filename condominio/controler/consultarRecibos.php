<?php
/*Objetos En Caso Se No Encontrarse Datos*/
function createObject($arrKey){
	$nomVar = array();
	foreach($arrKey as $key => $value){
		$nomVar[$value] = '0';
	}
	return $nomVar;
}
function retrieve($obj,$consulta,$arrParam,$arrEmp){
	if($obj->selectDataThree($consulta,$arrParam)){
		if($obj->getNumRegistros()>0){
			$searRS = $obj->getRegistros();
		}else{
			$empResSet = createObject($arrEmp);
			$searRS = $empResSet;
		}	
	}else{
		$empResSet = createObject($arrEmp);
		$searRS = $empResSet;
	}
	return $searRS;
}

function retrieveDos($obj,$consulta,$arrParam,$arrEmp){
	if($obj->selectDataOne($consulta,$arrParam)){
		if($obj->getNumRegistros()>0){
			$searRS = $obj->getRegistros();
		}else{
			//$empResSet = createObject($arrEmp);
			//$searRS = array($empResSet);
			$searRS = array();
		}	
	}else{
		//$empResSet = createObject($arrEmp);
		//$searRS = array($empResSet);
		$searRS = array();
	}
	return $searRS;
}

function chkfornull($object){
	$objcorr = new stdClass; 
	foreach($object as $key => $value){
		if($value == null){
			$objcorr -> $key = '0';
		}else{
			$objcorr -> $key = $value;
		}
	}
	return $objcorr;
}

/* Hasta Aqui Los Objetos*/
if($adminPermission && $compParam){
	$database = new Database();
	$db = $database->getConnection();
	if($db != null){
		$general = new GeneralObject($db);
		switch($llave){
			case 'gastostotales':
				$consulta = "SELECT 
							(SELECT ROUND(SUM(monto),2) FROM  facturas_egresos WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec) AS Facturas,
							(SELECT ROUND(SUM(monto),2) FROM  recibos_egresos WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec) AS Recibos,
							(SELECT ROUND(SUM(monto),2) FROM  recibos_egresos_nomina WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec) AS Nomina,
							(SELECT ROUND(SUM(monto),2) FROM  comisiones_bancarias WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec) AS Bancarios, 
							(SELECT ROUND(SUM(monto),2) FROM  cuentas_por_pagar WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec) AS Deudas ";
				$arrParam = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha];
				$arrEmp = ['Facturas','Recibos','Nomina','Bancarios','Deudas'];
				$totGas1 = retrieve($general,$consulta,$arrParam,$arrEmp);
				$totGastos = chkfornull($totGas1);
				
				$consulta = "SELECT
							(SELECT ROUND(SUM(monto),2) FROM facturas_egresos WHERE cod_edificio = :coe AND status = :st AND tipo_pago = :tipa AND fecha <= :fec) AS Facturas,
							(SELECT ROUND(SUM(monto),2) FROM recibos_egresos WHERE cod_edificio = :coe AND status = :st AND tipo_pago = :tipa AND fecha <= :fec) AS Recibos,
							(SELECT ROUND(SUM(monto),2) FROM recibos_egresos_nomina WHERE cod_edificio = :coe AND status = :st AND tipo_pago = :tipa AND fecha <= :fec) AS Nomina,
							(SELECT ROUND(SUM(monto),2) FROM comisiones_bancarias WHERE cod_edificio = :coe AND status = :st AND tipo_pago = :tipa AND fecha <= :fec) AS Bancarios";
				$arrParam = [':coe'=>$codEd,':st'=>0,':tipa'=>'fondoR',':fec'=>$fecha];
				$arrEmp = ['Facturas','Recibos','Nomina','Bancarios'];
				$tUFR1 = retrieve($general,$consulta,$arrParam,$arrEmp);
				$totUsFR = chkfornull($tUFR1);
				
				echo json_encode(array('gastos'=>$totGastos,'fondoreserva'=>$totUsFR));
			break;
			
			case 'cobrorecibo':
//NUMERO DEL RECIBO
				$consulta =  "SELECT cont_rec_cob AS control FROM controles_recibos_cobro WHERE cod_edificio = :coe ORDER BY cont_rec_cob DESC LIMIT 1";
				$arrParam=[':coe'=>$codEd];
				$arrEmp = ['control'];
				$control = retrieveDos($general,$consulta,$arrParam,$arrEmp);

//0.BUSQUEDA DEL PERIODO
				$consulta = "SELECT DATE_FORMAT(MIN(fecha),'%d/%m/%Y') AS Desde,DATE_FORMAT(MAX(fecha),'%d/%m/ %Y') AS Hasta FROM(
									SELECT fecha,status,cod_edificio FROM facturas_egresos UNION ALL 
									SELECT fecha,status,cod_edificio FROM recibos_egresos UNION ALL
									SELECT fecha,status,cod_edificio FROM recibos_egresos_nomina UNION ALL
									SELECT fecha,status,cod_edificio FROM cuentas_por_pagar UNION ALL
									SELECT fecha,status,cod_edificio FROM comisiones_bancarias) AS periodo WHERE cod_edificio = :coe AND status = :st ORDER BY fecha";
				$arrParam = [':coe'=>$codEd,':st'=>0];
				$arrEmp = ['Desde','Hasta'];
				$periodo = retrieve($general,$consulta,$arrParam,$arrEmp);
				if($periodo['Desde'] == null){$periodo['Desde'] = date('d/m/Y');} 
				if($periodo['Hasta'] == null){$periodo['Hasta'] = date('d/m/Y');}
//0. BUSQUEDA DEL ULTIMO RECIBO DE COBRO
				//ultimo recibo de cobro
				$consulta = "SELECT id,control,codigo,DATE_FORMAT(hasta,'%d/%m/%Y') AS hasta ,codigo_provision FROM recibos_cobro WHERE cod_edificio = :coe ORDER BY id DESC LIMIT 1";
				$arrParam = [':coe'=>$codEd];
				$arrEmp = ['id','control','codigo','hasta','codigo_provision'];
				$registros = retrieve($general,$consulta,$arrParam,$arrEmp);
				//adecuacion de las fechas de busqheda segun la ultima del recibo anterior	
				$date1 = date_create_from_format("d/m/Y",$periodo['Desde']);
				$comp1 = date_format($date1,"Y-m-d");
				$date2 = date_create_from_format("d/m/Y",$registros['hasta']);
				$comp2 = date_format($date2,"Y-m-d");
				if($comp1 >= $comp2){
					$date3 = date_create(date("Y-m-d",strtotime($comp2."+ 1 days")));
					$periodo['Desde'] = date_format($date3,"d/m/Y");
				}
//1. TOTAL GASTOS A COBRAR SIN FONDO DE RESERVA
				//1.1. resumen
				$consulta = "SELECT tipo_gasto,nombre_cta,sum(monto) AS monto FROM (
									SELECT tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM facturas_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta UNION ALL 
									SELECT tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM recibos_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
									UNION ALL 
									SELECT tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM recibos_egresos_nomina INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
									UNION ALL 
									SELECT tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM comisiones_bancarias INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
							) AS resumen_cobro WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec AND NOT tipo_pago='fondoR' GROUP BY tipo_gasto";
				$arrParam = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha];
				$arrEmp = ['tipo_gasto','nombre_cta','monto'];
				$resumen_cobro = retrieveDos($general,$consulta,$arrParam,$arrEmp);
				
				//1.2 GASTOS QUE NO SE HAN PAGADO AUN
				
				$consulta = "SELECT tipo_gasto,nombre_cta,sum(monto) AS monto FROM cuentas_por_pagar INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec GROUP BY tipo_gasto";
				$arrParam = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha];
				$arrEmp = ['tipo_gasto','nombre_cta','monto'];
				$ctas_pagar = retrieveDos($general,$consulta,$arrParam,$arrEmp);
				

//2. TOTAL GASTOS A COBRAR DEL FONDO DE RESERVA
				//2.1 resumen
				$consulta = "SELECT tipo_gasto,nombre_cta,sum(monto) AS monto FROM (
				SELECT tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM facturas_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
				UNION ALL 
				SELECT tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM recibos_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
				UNION ALL 
				SELECT tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM recibos_egresos_nomina INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
				UNION ALL 
				SELECT tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM comisiones_bancarias INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta) AS resumen_pagos_fr WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec AND tipo_pago = 'fondoR' GROUP BY tipo_gasto";
				$arrParam = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha];
				$arrEmp = ['tipo_gasto','nombre_cta','monto'];
				$resumen_pagos_fr = retrieveDos($general,$consulta,$arrParam,$arrEmp);

//4. PROVISIONES  NO CUMPLIDAS o cumplidas donde sobro dinero estatus 0
				$consulta = "SELECT tipo_gasto,nombre_cta,fecha,concepto,monto,usado FROM provisiones INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta WHERE cod_edificio = :coe AND status = :st";
				$arrParam = [':coe'=>$codEd,':st'=>0];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto','usado'];
				$prov_no_cumpl = retrieveDos($general,$consulta,$arrParam,$arrEmp);
			
				echo json_encode(array("control"=>$control,
										"ctas_pagar"=>$ctas_pagar,
									   "periodo"=>array($periodo), 
									   "resumen_cobro"=>$resumen_cobro,
									   "resumen_pagos_fr"=>$resumen_pagos_fr,
								       "prov_no_cumpl"=>$prov_no_cumpl));
			break;
			
			case 'detalles':
//NUMERO DEL RECIBO
				$consulta =  "SELECT cont_rec_cob AS control FROM controles_recibos_cobro WHERE cod_edificio = :coe ORDER BY cont_rec_cob DESC LIMIT 1";
				$arrParam=[':coe'=>$codEd];
				$arrEmp = ['control'];
				$control = retrieve($general,$consulta,$arrParam,$arrEmp);

//0.BUSQUEDA DEL PERIODO
				$consulta = "SELECT DATE_FORMAT(MIN(fecha),'%d/%m/%Y') AS Desde,DATE_FORMAT(MAX(fecha),'%d/%m/ %Y') AS Hasta FROM(
									SELECT fecha,status,cod_edificio FROM facturas_egresos UNION ALL 
									SELECT fecha,status,cod_edificio FROM recibos_egresos UNION ALL
									SELECT fecha,status,cod_edificio FROM recibos_egresos_nomina UNION ALL
									SELECT fecha,status,cod_edificio FROM cuentas_por_pagar UNION ALL
									SELECT fecha,status,cod_edificio FROM comisiones_bancarias) AS periodo WHERE cod_edificio = :coe AND status = :st ORDER BY fecha";
				$arrParam = [':coe'=>$codEd,':st'=>0];
				$arrEmp = ['Desde','Hasta'];
				$periodo = retrieve($general,$consulta,$arrParam,$arrEmp);
				if($periodo['Desde'] == null){$periodo['Desde'] = date('d/m/Y');} 
				if($periodo['Hasta'] == null){$periodo['Hasta'] = date('d/m/Y');}
//0. BUSQUEDA DEL ULTIMO RECIBO DE COBRO
				//ultimo recibo de cobro
				$consulta = "SELECT id,control,codigo,DATE_FORMAT(hasta,'%d/%m/%Y') AS hasta ,codigo_provision FROM recibos_cobro WHERE cod_edificio = :coe ORDER BY id DESC LIMIT 1";
				$arrParam = [':coe'=>$codEd];
				$arrEmp = ['id','control','codigo','hasta','codigo_provision'];
				$registros = retrieve($general,$consulta,$arrParam,$arrEmp);
				//adecuacion de las fechas de busqheda segun la ultima del recibo anterior	
				$date1 = date_create_from_format("d/m/Y",$periodo['Desde']);
				$comp1 = date_format($date1,"Y-m-d");
				$date2 = date_create_from_format("d/m/Y",$registros['hasta']);
				$comp2 = date_format($date2,"Y-m-d");
				if($comp1 >= $comp2){
					$date3 = date_create(date("Y-m-d",strtotime($comp2."+ 1 days")));
					$periodo['Desde'] = date_format($date3,"d/m/Y");
				}
//1. TOTAL GASTOS A COBRAR SIN FONDO DE RESERVA
				//1.2 total
				$consulta = "SELECT LPAD(control,4,0) AS control,tipo_gasto,nombre_cta,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,concepto,ROUND(monto,2) AS monto FROM (
				SELECT control,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM facturas_egresos
				INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta				
				UNION ALL 
				SELECT control,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos_nomina INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
				UNION ALL 
				SELECT control,tipo_gasto,nombre_cta,fecha,nota AS concepto,monto,tipo_pago,cod_edificio,status FROM comisiones_bancarias INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta) AS total_cobro WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec AND NOT tipo_pago='fondoR' ORDER BY tipo_gasto";
				$arrParam = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto'];
				$total_cobro = retrieveDos($general,$consulta,$arrParam,$arrEmp);				
//1.3  CUENTAS POR PAGAR PERIODO ANTERIOR
				$consulta = "SELECT LPAD(control,4,0) AS control,tipo_gasto,nombre_cta,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,concepto,ROUND(monto,2) AS monto FROM cuentas_por_pagar INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec";
				$arrParam = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto'];
				$ctas_pagar = retrieveDos($general,$consulta,$arrParam,$arrEmp);
				
//2. TOTAL GASTOS A COBRAR DEL FONDO DE RESERVA
				//2.2 total
				$consulta = "SELECT LPAD(control,4,0) AS control,tipo_gasto,nombre_cta,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,concepto,ROUND(monto,2) AS monto FROM (
				SELECT control,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM facturas_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos_nomina INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,tipo_gasto,nombre_cta,fecha,nota AS concepto,monto,tipo_pago,cod_edificio,status FROM comisiones_bancarias INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta) AS total_pagos_fr WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec AND tipo_pago='fondoR' ORDER BY tipo_gasto";
				$arrParam = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto'];
				$total_pagos_fr = retrieveDos($general,$consulta,$arrParam,$arrEmp);
//3 pagos de proveniente del dinero de las provisiones del recibo anterior estatus 1 
				//3.2 total
				$consulta = "SELECT LPAD(control,4,0) AS control,tipo_gasto,nombre_cta,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,concepto,ROUND(monto,2) AS monto FROM (
				SELECT control,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM facturas_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos_nomina INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
				UNION ALL 
				SELECT control,tipo_gasto,nombre_cta,fecha,nota AS concepto,monto,tipo_pago,cod_edificio,status FROM comisiones_bancarias INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta) AS total_provisiones WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec ORDER BY tipo_gasto";
				$arrParam = [':coe'=>$codEd,':st'=>1,':fec'=>$fecha];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto'];
				$total_provisiones = retrieveDos($general,$consulta,$arrParam,$arrEmp);
				
//5. PROVISIONES CUMPLIDAS
				$consulta = "SELECT LPAD(control,4,0) AS control,tipo_gasto,nombre_cta,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,concepto,ROUND(monto,2) AS monto FROM provisiones INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta WHERE cod_edificio = :coe AND status = :st";
				$arrParam = [':coe'=>$codEd,':st'=>1];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto'];
				$prov_cumpl = retrieveDos($general,$consulta,$arrParam,$arrEmp);
				
				/*
				faltan reflejar las cuentas por pagar que tenian status 1 y pasaron a status 2 (el status 1 se consigue al relacionarlas en el recibo de cobro, y se debe demostrar que se pagaron; al pagarlas, se consigue el status 2). Despues de mostrarlas en el recibo de cobro como pagadas pasan a tener el status 3.
				no se van a cargar cuentas por pagar del status 1 porque ya se recibio el dinero para pagarlas, solo deben demostrarse
				*/
				
				echo json_encode(array(
								"control"=>$control,
								"periodo"=>array($periodo),
								"total_cobro"=> $total_cobro,
								"ctas_pagar"=>$ctas_pagar,
								"total_pagos_fr"=>$total_pagos_fr,
								"total_provisiones"=>$total_provisiones,
								"prov_cumpl"=>$prov_cumpl));
			break;
			
			case 'historicorecibo':
//1. CONSULTA DEL RECIBO
				$consulta = "SELECT codigo,codigo_provision,fecha,vencimiento,desde,hasta,papfr,prefr,pie,reserva,provision,porpagar,monto,recib FROM recibos_cobro WHERE cod_edificio = :coe AND control = :con";
				$arrParam = [':coe'=>$codEd,':con'=>$control];
				$arrEmp = ['NoHay'];
				$recibo_ant = retrieve($general,$consulta,$arrParam,$arrEmp);
				
				$desde = isset($recibo_ant['desde']) ? date_format(date_create($recibo_ant['desde']),"d/m/Y") : date("d/m/Y");
				$hasta = isset($recibo_ant['hasta']) ? date_format(date_create($recibo_ant['hasta']),"d/m/Y") : date("d/m/Y");
				$codigo = isset($recibo_ant['codigo']) ? $recibo_ant['codigo'] : 'COBRO000000000';
				$codigoProv = isset($recibo_ant['codigo_provision']) ? $recibo_ant['codigo_provision'] : 'PROVI000000000';
				//busqueda del codigo provisiones del recibo anterior AL ANTERIOR
				$contrdos = intval($control)-1;
				$consulta = "SELECT codigo_provision FROM recibos_cobro WHERE cod_edificio = :coe AND control = :con";
				$arrParam = [':coe'=>$codEd,':con'=>$contrdos];
				$arrEmp = ['desde','hasta','codigo','fecha','vencimiento'];
				$registro = retrieve($general,$consulta,$arrParam,$arrEmp);
				$codProvAnt = isset($registro['codigo_provision']) ? $registro['codigo_provision'] : 'PROVI000000000';

//2.CUENTAS POR PAGAR PERIODO ANTERIOR
				$consulta = "SELECT LPAD(control,4,0) AS control,tipo_gasto,nombre_cta,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,concepto,ROUND(monto,2) AS monto FROM cuentas_por_pagar INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta WHERE cod_edificio = :coe AND codigo = :co";
				$arrParam = [':coe'=>$codEd,':co'=>$codigo];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto'];
				$ctas_pagar = retrieveDos($general,$consulta,$arrParam,$arrEmp);				
//1. TOTAL GASTOS A COBRAR SIN FONDO DE RESERVA
				//1.1. resumen
				$consulta = "SELECT tipo_gasto,nombre_cta,sum(monto) AS monto FROM (
									SELECT codigo,tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM facturas_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta UNION ALL 
									SELECT codigo,tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM recibos_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
									UNION ALL 
									SELECT codigo,tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM recibos_egresos_nomina INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
									UNION ALL 
									SELECT codigo,tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM comisiones_bancarias INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
							) AS resumen_cobro WHERE cod_edificio = :coe AND status = :st AND NOT tipo_pago='fondoR' AND codigo = :co GROUP BY tipo_gasto";
				$arrParam = [':coe'=>$codEd,':st'=>2,':co'=>$codigo];
				$arrEmp = ['tipo_gasto','nombre_cta','monto'];
				$resumen_cobro = retrieveDos($general,$consulta,$arrParam,$arrEmp);

//2. TOTAL GASTOS A COBRAR DEL FONDO DE RESERVA
				//2.1 resumen
				$consulta = "SELECT tipo_gasto,nombre_cta,sum(monto) AS monto FROM (
				SELECT codigo,tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM facturas_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
				UNION ALL 
				SELECT codigo,tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM recibos_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
				UNION ALL 
				SELECT codigo,tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM recibos_egresos_nomina INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
				UNION ALL 
				SELECT codigo,tipo_gasto,fecha,nombre_cta,monto,cod_edificio,status,tipo_pago FROM comisiones_bancarias INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta) AS resumen_pagos_fr WHERE cod_edificio = :coe AND status = :st AND tipo_pago = 'fondoR' AND codigo = :co GROUP BY tipo_gasto";
				$arrParam = [':coe'=>$codEd,':st'=>2,':co'=>$codigo];
				$arrEmp = ['tipo_gasto','nombre_cta','monto'];
				$resumen_pagos_fr = retrieveDos($general,$consulta,$arrParam,$arrEmp);
//4. PROVISIONES  NO CUMPLIDAS o cumplidas donde sobro dinero estatus 0
				$consulta = "SELECT tipo_gasto,nombre_cta,fecha,concepto,monto,usado FROM provisiones INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta WHERE cod_edificio = :coe AND status = :st AND codigo = :co";
				$arrParam = [':coe'=>$codEd,':st'=>2,':co'=>$codProvAnt];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto','usado'];
				$prov_no_cumpl = retrieveDos($general,$consulta,$arrParam,$arrEmp);
//PROVISIONES  PERTENECIENTES AL RECIBO	
				$consulta = "SELECT tipo_gasto AS tipoGasto,nombre_cta AS nombreGasto,fecha,concepto AS provision,monto,usado FROM provisiones INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta WHERE cod_edificio = :coe AND codigo = :co";
				$arrParam = [':coe'=>$codEd,':co'=>$codigoProv];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto','usado'];
				$pro_actuales = retrieveDos($general,$consulta,$arrParam,$arrEmp);
//DINERO SACADO DE LA CUENTA dinero_en_provisiones
				$consulta = "SELECT (monto * -1) AS monto FROM dinero_en_provisiones WHERE cod_edificio = :coe AND codigo_cpcp = :co";
				$arrParam = [':coe'=>$codEd,':co'=>$codigo];
				$arrEmp = ['monto'];
				$dineroProv = retrieveDos($general,$consulta,$arrParam,$arrEmp);
				echo json_encode(array("periodo"=>[array('Desde'=>$desde,'Hasta'=>$hasta)],
									   "recibo_ant"=>$recibo_ant,
									   "ctas_pagar"=>$ctas_pagar,
									   "resumen_cobro"=>$resumen_cobro,
									   "resumen_pagos_fr"=>$resumen_pagos_fr,
								       "prov_no_cumpl"=>$prov_no_cumpl,
									   "pro_actuales" => $pro_actuales,
									   "dineroProv"=>$dineroProv));
				break;
				
				case 'historicoresumen':
//1. CONSULTA DEL RECIBO
				$consulta = "SELECT codigo,codigo_provision,fecha,vencimiento,desde,hasta,papfr,prefr,pie,reserva,provision,porpagar,monto,recib FROM recibos_cobro WHERE cod_edificio = :coe AND control = :con";
				$arrParam = [':coe'=>$codEd,':con'=>$control];
				$arrEmp = ['NoHay'];
				$recibo_ant = retrieve($general,$consulta,$arrParam,$arrEmp);
				
				$desde = isset($recibo_ant['desde']) ? date_format(date_create($recibo_ant['desde']),"d/m/Y") : date("d/m/Y");
				$hasta = isset($recibo_ant['hasta']) ? date_format(date_create($recibo_ant['hasta']),"d/m/Y") : date("d/m/Y");
				$codigo = isset($recibo_ant['codigo']) ? $recibo_ant['codigo'] : 'COBRO000000000';
				$codigoProv = isset($recibo_ant['codigo_provision']) ? $recibo_ant['codigo_provision'] : 'PROVI000000000';
				//busqueda del codigo provisiones del recibo anterior AL ANTERIOR
				$contrdos = intval($control)-1;
				$consulta = "SELECT codigo_provision FROM recibos_cobro WHERE cod_edificio = :coe AND control = :con";
				$arrParam = [':coe'=>$codEd,':con'=>$contrdos];
				$arrEmp = ['desde','hasta','codigo','fecha','vencimiento'];
				$registro = retrieve($general,$consulta,$arrParam,$arrEmp);
				$codProvAnt = isset($registro['codigo_provision']) ? $registro['codigo_provision'] : 'PROVI000000000';
//2. TOTAL GASTOS A COBRAR SIN FONDO DE RESERVA
				//1.2 total
				$consulta = "SELECT LPAD(control,4,0) AS control,tipo_gasto,nombre_cta,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,concepto,ROUND(monto,2) AS monto FROM (
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM facturas_egresos
				INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta				
				UNION ALL 
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos_nomina INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
				UNION ALL 
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,nota AS concepto,monto,tipo_pago,cod_edificio,status FROM comisiones_bancarias INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta) AS total_cobro WHERE cod_edificio = :coe AND status = :st AND codigo = :co AND NOT tipo_pago='fondoR' ORDER BY tipo_gasto";
				$arrParam = [':coe'=>$codEd,':st'=>2,':co'=>$codigo];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto'];
				$total_cobro = retrieveDos($general,$consulta,$arrParam,$arrEmp);
//3  CUENTAS POR PAGAR PERIODO ANTERIOR
				$consulta = "SELECT LPAD(control,4,0) AS control,codigo,tipo_gasto,nombre_cta,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,concepto,ROUND(monto,2) AS monto FROM cuentas_por_pagar INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta WHERE cod_edificio = :coe AND codigo = :co";
				$arrParam = [':coe'=>$codEd,':co'=>$codigo];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto'];
				$ctas_pagar = retrieveDos($general,$consulta,$arrParam,$arrEmp);
//4. TOTAL GASTOS A COBRAR DEL FONDO DE RESERVA
				//2.2 total
				$consulta = "SELECT LPAD(control,4,0) AS control,tipo_gasto,nombre_cta,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,concepto,ROUND(monto,2) AS monto FROM (
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM facturas_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos_nomina INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,nota AS concepto,monto,tipo_pago,cod_edificio,status FROM comisiones_bancarias INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta) AS total_pagos_fr WHERE cod_edificio = :coe AND status = :st AND codigo = :co AND tipo_pago='fondoR' ORDER BY tipo_gasto";
				$arrParam = [':coe'=>$codEd,':st'=>2,':co'=>$codigo];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto'];
				$total_pagos_fr = retrieveDos($general,$consulta,$arrParam,$arrEmp);
//5. pagos de proveniente del dinero de las provisiones del recibo anterior estatus 3 
				//3.2 total
				$consulta = "SELECT LPAD(control,4,0) AS control,tipo_gasto,nombre_cta,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,concepto,ROUND(monto,2) AS monto FROM (
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM facturas_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta
				UNION ALL 
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,concepto,monto,tipo_pago,cod_edificio,status FROM recibos_egresos_nomina INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta 
				UNION ALL 
				SELECT control,codigo,tipo_gasto,nombre_cta,fecha,nota AS concepto,monto,tipo_pago,cod_edificio,status FROM comisiones_bancarias INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta) AS total_provisiones WHERE cod_edificio = :coe AND status = :st AND codigo = :co ORDER BY tipo_gasto";
				$arrParam = [':coe'=>$codEd,':st'=>3,':co'=>$codigo];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto'];
				$total_provisiones = retrieveDos($general,$consulta,$arrParam,$arrEmp);
//6. PROVISIONES CUMPLIDAS estatus 4
				$consulta = "SELECT LPAD(control,4,0) AS control,tipo_gasto,nombre_cta,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,concepto,ROUND(monto,2) AS monto FROM provisiones INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta WHERE cod_edificio = :coe AND status = :st AND codigo = :co";
				$arrParam = [':coe'=>$codEd,':st'=>4,':co'=>$codProvAnt];
				$arrEmp = ['tipo_gasto','nombre_cta','fecha','concepto','monto'];
				$prov_cumpl = retrieveDos($general,$consulta,$arrParam,$arrEmp);				
				
				echo json_encode(array(
								/*"control"=>$control,*/
								"periodo"=>[array('Desde'=>$desde,'Hasta'=>$hasta)],
								"total_cobro"=> $total_cobro,
								"ctas_pagar"=>$ctas_pagar,
								"total_pagos_fr"=>$total_pagos_fr,
								"total_provisiones"=>$total_provisiones,
								"prov_cumpl"=>$prov_cumpl));			
				break;

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