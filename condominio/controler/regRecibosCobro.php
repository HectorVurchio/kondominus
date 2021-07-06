<?php
if($adminPermission && $compParam){
	$arrval = '';
	$mes = date("m");
	$ano = date("Y");
	$fecha = date("Y-m-d");
	$database = new Database();
	$db = $database->getConnection();
	if($db != null){
		$general = new GeneralObject($db);
		$tot_FR = 0;
//CONSULTA PERIODO DE GASTOS
		$per = false;
		$consulta = "SELECT MIN(fecha) AS Desde,MAX(fecha) AS Hasta FROM(
									SELECT fecha,status,cod_edificio FROM facturas_egresos UNION ALL 
									SELECT fecha,status,cod_edificio FROM recibos_egresos UNION ALL
									SELECT fecha,status,cod_edificio FROM recibos_egresos_nomina UNION ALL
									SELECT fecha,status,cod_edificio FROM cuentas_por_pagar UNION ALL
									SELECT fecha,status,cod_edificio FROM comisiones_bancarias) AS periodo WHERE cod_edificio = :coe AND status = :st ORDER BY fecha";
		$arrParam = [':coe'=>$codEd,':st'=>0];
		if($general->selectDataThree($consulta,$arrParam)){
			$periodo = $general->getRegistros();
			if($periodo['Desde'] == null){$periodo['Desde'] = $fecha;} 
			if($periodo['Hasta'] == null){$periodo['Hasta'] = $fecha;}
			$desde = $periodo['Desde'];
			$hasta = $periodo['Hasta'];
			$per = true;
		}else{
			$per = false;
		}

//CONSULTA GASTOS EFECTUADOS SIN FONDO DE RESERVA
		$consulta = "SELECT sum(monto) AS monto FROM (
									SELECT fecha,monto,cod_edificio,status,tipo_pago FROM facturas_egresos
									UNION ALL 
									SELECT fecha,monto,cod_edificio,status,tipo_pago FROM recibos_egresos  
									UNION ALL 
									SELECT fecha,monto,cod_edificio,status,tipo_pago FROM recibos_egresos_nomina 
									UNION ALL 
									SELECT fecha,monto,cod_edificio,status,tipo_pago FROM comisiones_bancarias
							) AS resumen_cobro WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec AND NOT tipo_pago='fondoR' ";
		$arrParam = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha];
		if($general->selectDataThree($consulta,$arrParam)){
			$gastos_sin_fr = $general->getRegistros();
			$sinfr = true;
			if($gastos_sin_fr['monto'] == null){$gastos_sin_fr['monto']=0;}
			$gatosSFR = floatval($gastos_sin_fr['monto']);
			$tot_FR = $tot_FR + floatval($porcFR)*(0.01)*$gastos_sin_fr['monto'];
		}else{
			$sinfr = false;
			$gastos_sin_fr = 0;
		}
//CONSULTA CUENTAS POR PAGAR
		$consulta = "SELECT sum(monto) AS monto FROM cuentas_por_pagar INNER JOIN cuentas_contabilidad ON tipo_gasto = cod_cta WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec";
		$arrParam = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha];
		if($general->selectDataThree($consulta,$arrParam)){
			$ctas_ppagar = $general->getRegistros();
			$ctap = true;
			if($ctas_ppagar['monto'] == null){$ctas_ppagar['monto']=0;}
			$tot_FR = $tot_FR + floatval($porcFR)*(0.01)*$ctas_ppagar['monto']; // para fondo reserva
			$cppag = $ctas_ppagar['monto'];
		}else{
			$ctap = false;
			$ctas_ppagar = 0;
		}
//CONSULTA GASTOS DEL FONDO DE RESERVA
		$gastos_con_fr = 0;
		$consulta = "SELECT sum(monto) AS monto FROM (
				SELECT fecha,monto,cod_edificio,status,tipo_pago FROM facturas_egresos 
				UNION ALL 
				SELECT fecha,monto,cod_edificio,status,tipo_pago FROM recibos_egresos
				UNION ALL 
				SELECT fecha,monto,cod_edificio,status,tipo_pago FROM recibos_egresos_nomina
				UNION ALL 
				SELECT fecha,monto,cod_edificio,status,tipo_pago FROM comisiones_bancarias) 
				AS resumen_pagos_fr 
				WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec AND tipo_pago = 'fondoR'";
		$arrParam = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha];
		if($general->selectDataThree($consulta,$arrParam)){
			$gastos_con_fr = $general->getRegistros();
			$confr = true;
			if($gastos_con_fr['monto'] == null){$gastos_con_fr['monto']=0;}
			$tot_FR = $tot_FR + floatval($porcFR)*(0.01)*$gastos_con_fr['monto'];
			$recuperFR = floatval($porcRec)*(0.01)*$gastos_con_fr['monto'];//recuperacion de lo gastado FR
		}else{
			$confr = false;
		}
//CONSULTA PROVISIONES  NO CUMPLIDAS o cumplidas donde sobro dinero estatus 0		
		//ultimo recibo de cobro
		$consulta = "SELECT id,control,codigo,hasta,codigo_provision FROM recibos_cobro WHERE cod_edificio = :coe ORDER BY id DESC LIMIT 1";
		$arrParam = [':coe'=>$codEd];
		if($general->selectDataThree($consulta,$arrParam)){
			$registros = $general->getRegistros();
			$codRant = $registros['codigo']; //codigo recibo anterior
			$codPran = $registros['codigo_provision']; //codigo de la provision anterior
			$flulrec = true; //flag de la busqueda del ultimo recibo
		}else{
			$flulrec = false;
			$codPran = 'NORECIBO';
			$codRant = 'NOCODIGO';
		}
		//adecuacion de las fechas de busqheda segun la ultima del recibo anterior	
		if($desde >= $registros['hasta']){
			$desde = date("Y-m-d",strtotime($registros['hasta']."+ 1 days"));
		}
		//cantidad disponible en provisiones
		$consulta = "SELECT  SUM(monto) AS monto FROM dinero_en_provisiones WHERE cod_edificio = :coe ";
		$arrParam = [':coe'=>$codEd];
		$IDprovSt2 = array(); //array los id de las provisiones que tendran estatus 2
		$IDprovSt4 = array(); //array de los id que tendran estatus 4
		$devolucion = 0; //total a devolver de lo no usado en provisiones
		$indProv = 0; //indice del array de provisiones hasta donde se devuelve dinero;
		$difProv = array(); // codigo y diferencia a devolver de cada provision para dinero_en_provisiones
		$ind2 = 0; // indice para el array $IDprovSt4
		if($general->selectDataThree($consulta,$arrParam)){
			$registros = $general->getRegistros();
			$dispProv = floatVal($registros['monto']); //cantidad disponible en la cuenta
			$consulta = "SELECT id,codigo,monto,usado FROM provisiones WHERE cod_edificio = :coe AND status = :st AND codigo = :co";	
			$arrParam = [':coe'=>$codEd,':st'=>0,':co'=>$codPran];
			if($general->selectDataOne($consulta,$arrParam)){
				$prov_no_cump = $general->getRegistros();
				$prnocum = true; // flag indicando que la consulta salio bien
				$index = 0;
				foreach($prov_no_cump as $index => $item){
					$diferencia = floatval($item['monto'])-floatval($item['usado']); //monto a devolver (unitario)
					if($dispProv > $diferencia){
						$devolucion = $devolucion + $diferencia;
						$dispProv = $dispProv - $diferencia;
						$indProv++;
						$difProv[$index] = array($item['codigo'],$diferencia);
						$IDprovSt2[$index] = $item['id'];
					}else{
						$devolucion = $devolucion + $dispProv;
						$dispProv = $dispProv - $dispProv;
						$indProv++;
						$difProv[$index] = array($item['codigo'],$dispProv);
						$IDprovSt2[$index] = $item['id'];
						break;
					}
				}
				
				for($i = $index+1;$i < count($prov_no_cump);$i++){
					$IDprovSt4[$ind2] = $prov_no_cump[$i]['id'];
					$ind2++;
				}
			}else{
				$prnocum = false;
			}
		}else{
			$prnocum = false;
		}
//CONSULTA PROPIETARIOS DEL EDIFICIO
		$consulta = "SELECT unidad,alicuota FROM propietarios WHERE cod_edificio = :coe AND NOT unidad = 'ADMIN'";
		$arrParam = [':coe'=>$codEd];
		if($general->selectDataOne($consulta,$arrParam)){
			$owners = $general->getRegistros();
			$property = true;
		}else{
			$property = false;
		}		
		if($per && $sinfr && $ctap && $confr && $prnocum && $property && $prnocum){
			$contcolOne = 'cont_rec_cob';
			$contNumOne = 'controles_recibos_cobro';
			$consulta =  "SELECT ${contcolOne} FROM ${contNumOne} WHERE cod_edificio = :coe ORDER BY ${contcolOne} DESC LIMIT 1";
			$arrParam=[':coe'=>$codEd];
			$flagTwo = ($general->selectDataThree($consulta,$arrParam)) ? true : false;
			$numObt = $general->getRegistros();
			$error = $general->getInfoError();
			if($flagTwo && $error == null){if(empty($numObt)){$numObt["${contcolOne}"] = 0;}}else{$numObt = null;}
			if($numObt != null){
				$nuectr = intval($numObt["${contcolOne}"]) + 1;
				$ctr = str_pad($nuectr,3,"0",STR_PAD_LEFT);
				$arrQuery = array();
//UPDATE SE ACTUALIZAN LOS ESTATUS Y LOS CODIGOS EN LOS EGRESOS
				$cobr = "COBRO${ano}${mes}${ctr}"; // actualizacion del codigo
				//para status 2			
				$consultaD = "UPDATE facturas_egresos SET status = :stu ,codigo = :co WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec";
				$arrParamD = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha,':stu'=> 2,':co'=>$cobr];
				array_push($arrQuery,array($consultaD,$arrParamD));
				$consultaD = "UPDATE recibos_egresos SET status = :stu ,codigo = :co WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec";
				$arrParamD = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha,':stu'=> 2,':co'=>$cobr];
				array_push($arrQuery,array($consultaD,$arrParamD));			
				$consultaD = "UPDATE recibos_egresos_nomina SET status = :stu,codigo = :co  WHERE cod_edificio = :coe  AND status= :st  AND fecha <= :fec";
				$arrParamD = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha,':stu'=> 2,':co'=>$cobr];
				array_push($arrQuery,array($consultaD,$arrParamD));
				$consultaD = "UPDATE comisiones_bancarias SET status = :stu ,codigo = :co WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec";
				$arrParamD = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha,':stu'=> 2,':co'=>$cobr];
				array_push($arrQuery,array($consultaD,$arrParamD));
				//cuentas por pagar de status 0 para status 1
				$consultaD = "UPDATE cuentas_por_pagar SET status = :stu ,codigo = :co WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec";
				$arrParamD = [':coe'=>$codEd,':st'=>0,':fec'=>$fecha,':stu'=> 1,':co'=>$cobr];
				array_push($arrQuery,array($consultaD,$arrParamD));
				
				
				/* 
				falta actualizar cuentas por pagar de status 2 a status 3 (fue mostrado (todavia no) en este recibo que se pagaron y pasaran al status 3 se reflja solo en el detalles)
				*/
	
				
				//para status 3
				$consultaD = "UPDATE facturas_egresos SET status = :stu, codigo = :co WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec";
				$arrParamD = [':coe'=>$codEd,':st'=>1,':fec'=>$fecha,':stu'=> 3,':co'=>$cobr];
				array_push($arrQuery,array($consultaD,$arrParamD));
				$consultaD = "UPDATE recibos_egresos SET status = :stu, codigo = :co WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec";
				$arrParamD = [':coe'=>$codEd,':st'=>1,':fec'=>$fecha,':stu'=> 3,':co'=>$cobr];
				array_push($arrQuery,array($consultaD,$arrParamD));
				$consultaD = "UPDATE recibos_egresos_nomina SET status = :stu, codigo = :co WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec";
				$arrParamD = [':coe'=>$codEd,':st'=>1,':fec'=>$fecha,':stu'=> 3,':co'=>$cobr];
				array_push($arrQuery,array($consultaD,$arrParamD));
				$consultaD = "UPDATE comisiones_bancarias SET status = :stu, codigo = :co WHERE cod_edificio = :coe AND status = :st AND fecha <= :fec";
				$arrParamD = [':coe'=>$codEd,':st'=>1,':fec'=>$fecha,':stu'=> 3,':co'=>$cobr];
				array_push($arrQuery,array($consultaD,$arrParamD));
//UPDATE PROVISIONES  NO CUMPLIDAS o cumplidas donde sobro dinero estatus 0 para status 2
				//provisiones estatus 0 para estatus 2
				foreach($IDprovSt2 as $index => $item){
					$consultaD = "UPDATE provisiones SET status = 2 WHERE cod_edificio = :coe AND id = :id";
					$arrParamD = [':coe'=>$codEd,':id'=>$item];
					array_push($arrQuery,array($consultaD,$arrParamD));
				}
				//provisiones estatus 0 para estatus 4
				foreach($IDprovSt4 as $index => $item){
					$consultaD = "UPDATE provisiones SET status = 4 WHERE cod_edificio = :coe AND id = :id";
					$arrParamD = [':coe'=>$codEd,':id'=>$item];
					array_push($arrQuery,array($consultaD,$arrParamD));
				}
//UPDATE PROVISIONES  CUMPLIDAS DODNDE NO SOBRO DINERO 
				//provisiones estatus 1 para status 3
				$consultaD = "UPDATE provisiones SET status = 3 WHERE cod_edificio = :coe AND status = :st";
				$arrParamD = [':coe'=>$codEd,':st'=>1];
				array_push($arrQuery,array($consultaD,$arrParamD));		
//INSERT SE INSERTAN LAS NUEVAS PROVISIONES status 0
				$prov = "PROVI${ano}${mes}${ctr}"; //codigo para las provisiones
				$monP = 0; //monto a pagar por provisiones
				$arrParamUno = array();
				foreach($provisiones as $index => $item){
					$arrval .= "(:coe${index},:st${index},:ctr${index},:co${index},:tiga${index},:fec${index},  :mo${index},:us${index},:con${index},:nuac${index},:cre${index})";
					if($index == count($provisiones) - 1){$arrval .= ';';}else{$arrval .= ',';}
					$arrParamUno[":coe${index}"] = $codEd;
					$arrParamUno[":st${index}"] = 0;
					$arrParamUno[":ctr${index}"] = $nuectr;
					$arrParamUno[":co${index}"] = $prov;
					$arrParamUno[":tiga${index}"] = $item -> tipo_gasto;
					$arrParamUno[":fec${index}"] = $fecha;
					$arrParamUno[":mo${index}"] = $item -> monto;
					$arrParamUno[":us${index}"]= 0;
					$arrParamUno[":con${index}"] = $item -> concepto;
					$arrParamUno[":nuac${index}"] = $numero_aceso;
					$arrParamUno[":cre${index}"] = date('Y-m-d H:i:s');
					$monP = $monP + floatval($item -> monto);
				}
				if(count($arrParamUno) > 0){
					$tot_FR = $tot_FR + floatval($porcFR)*(0.01)*$monP;
					$consultaD = "INSERT INTO provisiones (cod_edificio,status,control,codigo,tipo_gasto,fecha,monto,usado,concepto,numero_acceso,creada) VALUES ${arrval}";
					array_push($arrQuery,array($consultaD,$arrParamUno));	
				}
//total a pagar		
				/*
				$cppag = cuentas por pagar
				$monP = monto a pagar por provisiones actuales
				$tot_FR = % de los gastos hechos en total para cargar a el fondo de reserva(ej 10%)
				$gatosSFR = gastos hechos sin utilizar el fondo de reserva
				$recuperFR = % de lo gastado con el fondo de reserva a recuperar (ej 90%)
				*/
				$totalRecibo = $cppag + $monP + $tot_FR + $gatosSFR + $recuperFR - $devolucion; 
				$reserva = $tot_FR + $recuperFR; //cantidad destinada la fondo reserva
//INSERT INSERTA EN TABLA recibos_cobro
				$consultaD = "INSERT INTO recibos_cobro SET cod_edificio = :coe,status = :st,control = :ctr, codigo = :co,codigo_provision = :copro,fecha = :fec,vencimiento = :ven,desde = :des, hasta = :has,papfr = :paf,prefr = :pre,pie = :pie,reserva = :res,provision = :pro, porpagar = :ppag,monto = :mo,recib = :re,numero_acceso = :nuac,creada = :cre ";
				$arrParamD = [":coe"=>$codEd,":st" => 0,":ctr" => $nuectr,":co" => $cobr, ":copro"=>$prov,":fec"=>$fecha,":ven"=>$vence, ":des"=>$desde, ":has"=>$hasta,":paf"=>$porcFR, ":pre"=>$porcRec, ":pie"=>$piepag, ":res"=>$reserva,":pro"=>$monP,":ppag"=>$cppag, ":mo"=>$totalRecibo, ":re"=> 0, ":nuac"=>$numero_aceso,":cre"=>date('Y-m-d H:i:s')];//revisar si hay devolucion
				array_push($arrQuery,array($consultaD,$arrParamD));
//INSERT NUEVO NUMERO DE CONTROL EN TABLA DE CONTROLES
				$consultaD = "INSERT INTO ${contNumOne} SET cod_edificio = :coe, ${contcolOne} = :crp, numero_acceso = :nuac";
				$arrParamD = [':coe'=>$codEd,':crp'=>$nuectr,':nuac'=>$numero_aceso];
				array_push($arrQuery,array($consultaD,$arrParamD));			
//INSERT SACAR EL SOBRANTE DE LA CUENTA DE PROVISIONES Y DEVOLVERLO AL BANCO
				foreach($difProv as $index => $item){
					$codban = $item[0]; // codigo para la cuenta de banco ($cobr para dinero_en_provisiones)
					$devprov = round($item[1],2,PHP_ROUND_HALF_UP); //dinero devolucion por provision
					//sale dinero cuenta provisiones
					$consultaD = "INSERT INTO dinero_en_provisiones SET cod_edificio = :coe,fecha = :fec,recibo_numero = :renu, monto = :mo, codigo_cpcp = :co,cod_cta = :cocta, numero_acceso = :nuac ";
					$arrParamD = [":coe"=>$codEd,":fec"=>$fecha,":renu"=>$nuectr,":mo"=>(-1)*$devprov,":co"=>$cobr,":cocta"=>'0.3.4-PRODE',":nuac"=>$numero_aceso];
					array_push($arrQuery,array($consultaD,$arrParamD));
					//entra dinero cuenta de banco
					$consultaD = "INSERT INTO dinero_en_bancos SET cod_edificio = :coe,fecha = :fec,recibo_numero = :renu, monto = :mo, codigo_cpcp = :co,cod_cta = :cocta, numero_acceso = :nuac ";
					$arrParamD = [":coe"=>$codEd,":fec"=>$fecha,":renu"=>$nuectr,":mo"=>$devprov,":co"=>$codban,":cocta"=>'0.3.4-PRODE',":nuac"=>$numero_aceso];
					array_push($arrQuery,array($consultaD,$arrParamD));
				}			
//INSERT CREAR LAS CUENTAS POR COBRAR DE LOS PROPIETARIOS
				$arrParamUno = array();
				$arrval = '';
				foreach($owners as $index => $item){
					$arrval .= "(:coe${index},:st${index},:ctr${index},:co${index},:tiga${index},:fec${index},:mo${index},:re${index},:und${index},:con${index},:ven${index},:no${index},:nuac${index},:cre${index})";
					if($index == count($owners) - 1){$arrval .= ';';}else{$arrval .= ',';}
					$apagarprop = floatval($item['alicuota'])*floatval($totalRecibo);
					$arrParamUno[":coe${index}"] = $codEd;
					$arrParamUno[":st${index}"] = 0;
					$arrParamUno[":ctr${index}"] = $nuectr;
					$arrParamUno[":co${index}"] = $cobr;
					$arrParamUno[":tiga${index}"] = '1.1.1-CPCPR';
					$arrParamUno[":fec${index}"] = $fecha;
					$arrParamUno[":mo${index}"] = round ($apagarprop,2,PHP_ROUND_HALF_UP);
					$arrParamUno[":re${index}"] = 0;
					$arrParamUno[":und${index}"]= $item['unidad'];
					$arrParamUno[":con${index}"] = "Cuota de Mantenimiento Recibo ${ctr}";
					$arrParamUno[":ven${index}"] = $vence;
					$arrParamUno[":no${index}"] = "Recibo de Cobro ${ctr}";
					$arrParamUno[":nuac${index}"] = $numero_aceso;
					$arrParamUno[":cre${index}"] = date('Y-m-d H:i:s');	
				}
				$consultaD = "INSERT INTO ctas_por_cobrar (cod_edificio,status,control,codigo,tipo_gasto,fecha,monto,recib,unidad,concepto,vencimiento,nota,numero_acceso,creada) VALUES ${arrval} ";
				array_push($arrQuery,array($consultaD,$arrParamUno));			
//TRANSACCION		
				if($general->dataTransactionInsert($arrQuery)){
//MANDAR POR EMAIL A LOS PROPIETARIOS QUE TIENEN UNA NUEVA DEUDA
					http_response_code(200);
					echo json_encode(array("message" =>"Success",
										"response"=>"Registro Exitoso"));
				}else{
					http_response_code(404); //The requested resource could not be found.
					echo json_encode(array("message" =>"El Recurso No Fue Ejecutado En El Primer Nivel",
										"response"=>$general->getInfoError()));
				}

			}else{
				http_response_code(400);
				echo json_encode(array("message" =>"No hay registros o existe un error",
									"response"=>"Problemas De BD o Registros"));
			}	
		}
	
	}else{
		http_response_code(500);
		echo json_encode(array("message" =>"El Recurso No Fue Ejecutado En El Primer Nivel",
									"response"=>"Problemas De Conexión"));
	}
}else{
	http_response_code(501);
	echo json_encode(array("message" =>"El Recurso No Fue Ejecutado En El Segundo Nivel",
									"response"=>"Fallo De Parametros O Autorizacion"));
}
?>















