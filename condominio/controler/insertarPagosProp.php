<?php

function movDinero($tabla,$codEd,$fecha,$nueNu,$monto,$code,$tiga,$numero_aceso){
	$consulta = "INSERT INTO ${tabla} SET cod_edificio = :coe,fecha = :fec,recibo_numero = :ctr, monto = :mo, codigo_cpcp = :co, cod_cta = :cta ,numero_acceso = :nuac "; 
	$arrParam = [":coe" => $codEd,
	":fec" => $fecha,
	":ctr" => $nueNu,
	":mo" => number_format($monto, 2, '.', ''),
	":co" => $code,
	":cta" => $tiga,
	":nuac" => $numero_aceso]; 
	return array($consulta,$arrParam);
}

if($adminPermission && $compParam){
	$database = new Database();
	$db = $database->getConnection();
	$general = new GeneralObject($db);
	$fecha = date('Y-m-d');
	$feEx = explode("-",$fecha);
	$ano = $feEx[0];
	$mes = $feEx[1];
	if($db != null){
		switch($llave){
			case 'registro':
			$contNumOne = 'controles_pagos_prop';
			$contcolOne = 'co_pa_pr';
			/* tabla de controles*/
			$consulta =  "SELECT ${contcolOne} FROM ${contNumOne} WHERE cod_edificio = :coe ORDER BY ${contcolOne} DESC LIMIT 1";
			$arrParam=[':coe'=>$codEd];
			$flagTwo = ($general->selectDataThree($consulta,$arrParam)) ? true : false;
			$numObt = $general->getRegistros();
			$error = $general->getInfoError();
			if($flagTwo && $error == null){if(empty($numObt)){$numObt["${contcolOne}"] = 0;}}else{$numObt = null;}
			if($numObt != null){
				$nueNu = intval($numObt["${contcolOne}"])+1;
				$arrQuery = array();
				/* tabla de controles*/
				$consulta = "INSERT INTO ${contNumOne} SET cod_edificio = :coe, ${contcolOne} = :crp, numero_acceso = :nuac";
				$arrParam = [':coe'=>$codEd,':crp'=>$nueNu,':nuac'=>$numero_aceso];
				array_push($arrQuery,array($consulta,$arrParam));
				$consulta = "INSERT INTO  pagos_propietarios SET cod_edificio = :coe, status = :st,control = :ctr, codigo = :co, tipo_gasto = :tiga, unidad = :un, fecha = :fec, monto = :mo, tipo_pago = :tipa, referencia = :re, numero_acceso = :nuac, creada = :cre";
				$arrParam = array(':coe'=>$codEd,
							  ':st'=>0,
							  ':ctr'=>$nueNu,
							  ':co'=>'PROP'.$ano.$mes.$inmueble,
							  ':tiga'=>'4.0.1-APFCO',
							  ':un'=>$inmueble,
							  ':fec'=>$fecha,
							  ':mo'=>$monto,
							  ':tipa'=>$tipoPago,
							  ':re'=>$referencia,
							  ':nuac'=>$numero_aceso,
							  ':cre'=>$fecha);
				array_push($arrQuery,array($consulta,$arrParam));
				/* transaction */
				if($general->dataTransactionInsert($arrQuery)){
					http_response_code(200);
					echo json_encode(array("message" =>"Success",
									"response"=>"Registro Exitoso"));
				}else{
					http_response_code(400); //The requested resource could not be found.
					echo json_encode(array("message" =>"Failed Five",
									"response"=>$general->getInfoError()));
				}	
			}else{
				http_response_code(400);
				echo json_encode(array("message" =>"Failed Three",
									"response"=>$general->getInfoError()));
			}
		break;
		case 'confirma':
		//LUEGO DE CONFIRMADO EL PAGO, ESTE ENTRA A BANCO O EFECTIVO
			$consulta = "SELECT Clave FROM usuarios WHERE Correo = :cor LIMIT 0,1";
			$arrParam = [':cor'=>$email];
			if($general -> selectDataThree($consulta,$arrParam)){
				$num = $general->getNumRegistros();
				if($num > 0){
					$clave = $general->getRegistros()['Clave'];
			//VERIFICAR CON CLAVE DE USUARIO PARA EVITAR ACCIDENTES
					if(password_verify($password, $clave)){
						if($condicion == 'aceptac'){
							$nust = 1;
						}elseif($condicion == 'rechazo'){
							$nust = 2;
						}
				//VERIFICAR QUE EL PROPIETARIO NO TENGA PAGOS SIN REPORTAR
				/* 
				si hay un pago con status 1 en confirmacion_pagos, no se debe permitir otro, se reporta primero, este pasa a status 3 y luego se confirma el siguiente pago para que pase de status 0 a 1 en pagos_propietarios y se anote con status 1 en confirmacion_pagos
				*/
						$consulta = "SELECT id FROM confirmacion_pagos WHERE cod_edificio =:coe AND status = :st AND unidad = :uni";
						$arrParam = [':coe'=>$codEd,':st'=>1,':uni'=>$inmueble];
						if($general -> selectDataOne($consulta,$arrParam)){
							$num = $general->getNumRegistros();
							if($num > 0){
								http_response_code(400); //The requested resource could not be found.
								echo json_encode(array("message" =>"Reportar Ultimo Pago de la Unidad"));
								
							}else{
								$consulta = "SELECT control,codigo,tipo_pago FROM pagos_propietarios WHERE cod_edificio =:coe AND status = :st AND unidad = :uni";
								$arrParam = [':coe'=>$codEd,':st'=>0,':uni'=>$inmueble];
								if($general->selectDataThree($consulta,$arrParam)){
									$reg = $general->getRegistros();
									$tipoPago = $reg['tipo_pago'];
								}else{
									$tipoPago = null;
								}
								if($tipoPago != null){	
									$arrQuery = array();
									$consulta = "UPDATE pagos_propietarios SET status = :st WHERE cod_edificio =:coe AND control = :con AND unidad = :uni AND monto = :mon";
									$arrParam = [':st'=>$nust,
												 ':coe'=>$codEd,':con'=>$control,':uni'=>$inmueble,':mon'=>$monto];
									array_push($arrQuery,array($consulta,$arrParam));	
									$consulta = "INSERT INTO confirmacion_pagos(
									cod_edificio,control,status,codigo,unidad,fecha,monto,tipo_pago,numero_acceso) SELECT cod_edificio,control, :st AS status,codigo,unidad,fecha,monto,tipo_pago,:nuac AS numero_acceso FROM pagos_propietarios WHERE cod_edificio =:coe AND control = :con AND unidad = :uni AND monto = :mon";
									$arrParam = [':st'=>$nust,':nuac'=>$numero_aceso,':coe'=>$codEd,
												 ':con'=>$control,':uni'=>$inmueble,':mon'=>$monto];
									array_push($arrQuery,array($consulta,$arrParam));	
									$consulta = "UPDATE propietarios SET saldo = saldo + :mon WHERE cod_edificio =:coe AND unidad = :uni";
									$arrParam = [':mon'=>$monto,':coe'=>$codEd,':uni'=>$inmueble];
									array_push($arrQuery,array($consulta,$arrParam));
					//EL DINERO ENTRA A LA CUENTA CORRESPONDIENTE, SEA BANCO O EFECTIVO
									if($tipoPago == 'dineroEfec'){
										$tabla = 'dinero_en_efectivo';
									}elseif($tipoPago == 'dineroBan'){
										$tabla = 'from dinero_en_bancos';
									}
									$consulta = "INSERT INTO ${tabla} SET cod_edificio = :coe,fecha = :fec,recibo_numero = :renu,monto = :mo,codigo_cpcp = :co,cod_cta = :cta,numero_acceso = :nuac ";
									$arrParam = [':coe'=>$codEd,':fec'=>$fecha,':renu'=>$reg['control'],':mo'=>$monto,':co'=>$reg['codigo'],':cta'=>'4.0.2-PAPRO',':nuac'=>$numero_aceso];
									array_push($arrQuery,array($consulta,$arrParam));
									/* transaction */
									if($general->dataTransactionInsert($arrQuery)){
										http_response_code(200);
										echo json_encode(array("message" =>"Success",
													"response"=>"Registro Exitoso"));
									}else{
										http_response_code(404); //The requested resource could not be found.
										echo json_encode(array("message" =>"Fallo en Transaccion",
													"response"=>$general->getInfoError()));
									}									
								}
							
							}	
	
						}else{
							http_response_code(400); //The requested resource could not be found.
							echo json_encode(array("message" =>"Fallo en servidor 2",
									"response"=>$general->getInfoError()));
						}
					}else{
							http_response_code(400); //The requested resource could not be found.
							echo json_encode(array("message" =>"Clave invalida"));
					}
				}else{
					http_response_code(400); //The requested resource could not be found.
				echo json_encode(array("message" =>"Correo invalido"));
				}
			}else{
				http_response_code(400); //The requested resource could not be found.
				echo json_encode(array("message" =>"Fallo en servidor",
									"response"=>$general->getInfoError()));
			}	
		break;
		case 'reporta':
			//1. Cuanto debe el tercio?			
			$consulta = "SELECT 						control,codigo,fecha,monto,vencimiento,papfr,prefr,reserva,provision,porpagar,montot FROM( SELECT ctas_por_cobrar.control,ctas_por_cobrar.codigo,ctas_por_cobrar.fecha,ctas_por_cobrar.monto,
			ctas_por_cobrar.vencimiento,recibos_cobro.papfr,recibos_cobro.prefr,recibos_cobro.reserva,
			recibos_cobro.provision,recibos_cobro.porpagar,recibos_cobro.monto AS montot FROM ctas_por_cobrar LEFT JOIN 
			recibos_cobro ON ctas_por_cobrar.codigo = recibos_cobro.codigo 
				WHERE ctas_por_cobrar.cod_edificio = :coe 
				AND recibos_cobro.cod_edificio = :coe 
				AND ctas_por_cobrar.status = 0 
				AND ctas_por_cobrar.unidad = :un 
				UNION ALL 
				SELECT   ctas_por_cobrar.control,ctas_por_cobrar.codigo,ctas_por_cobrar.fecha,
				(ctas_por_cobrar.monto - ctas_por_cobrar.recib) AS monto,
				ctas_por_cobrar.vencimiento,recibos_cobro.papfr,recibos_cobro.prefr,recibos_cobro.reserva,
				recibos_cobro.provision,recibos_cobro.porpagar,recibos_cobro.monto AS montot 
				FROM ctas_por_cobrar 
				LEFT JOIN recibos_cobro 
				ON ctas_por_cobrar.codigo = recibos_cobro.codigo 
				WHERE ctas_por_cobrar.cod_edificio = :coe
				AND recibos_cobro.cod_edificio = :coe 
				AND ctas_por_cobrar.status = 1 
				AND ctas_por_cobrar.unidad = :un) ctas_unidas";		
			$arrParam = [':coe'=>$codEd,':un'=>$inmueble];
			if($general->selectDataOne($consulta,$arrParam)){
				$num = $general-> getNumRegistros();
				if($num > 0){
					$debe = $general->getRegistros();
				}else{
					$debe = 0;
				}
			}else{
				$debe = null;
			}	
			//2. cuanto tiene el tercio?
			$consulta = "SELECT cuenta_propietario,alicuota,TRUNCATE(saldo,2) AS saldo,creada FROM propietarios WHERE cod_edificio = :coe AND unidad = :un LIMIT 1";
			$arrParam=[':coe'=>$codEd,':un'=>$inmueble];
			if($general->selectDataThree($consulta,$arrParam)){
				$tiene = $general->getRegistros();
			}else{
				$tiene = null;
			}
			//3. en que forma de dinero posee el saldo el propietario	
		/*
			 el estatus en confirmacion_pagos tiene que ser 3 que es el de pagos reportados, 
			 entonces efectivo + banco - pagado = saldo anterior > 0 ;  
			 si efectivo > banco, el saldo anterior era efectivo
			 
			 como se hizo el pago actual? 
			 el pago actual tiene status 1 en confirmacion_pagos, por lo tanto se
			 obtienen como formult y pagult para ultima forma de pago y ultimo monto respectivamente.
			 
			*/			
			
			$consulta = "SELECT(SELECT SUM(monto) FROM confirmacion_pagos WHERE cod_edificio = :coe AND unidad = :un AND tipo_pago = 'dineroEfec' AND status = 3) AS efectivo,(SELECT SUM(monto) FROM confirmacion_pagos WHERE cod_edificio = :coe AND unidad = :un AND tipo_pago = 'dineroBan' AND status = 3 ) AS banco,(SELECT SUM(pagado) FROM pagos_reportados WHERE cod_edificio = :coe AND unidad = :un) AS pagado,(SELECT monto FROM confirmacion_pagos WHERE cod_edificio = :coe AND unidad = :un AND status = 1) AS pagult,(SELECT tipo_pago FROM confirmacion_pagos WHERE cod_edificio = :coe AND unidad = :un AND status = 1) AS formult ";
			$arrParam=[':coe'=>$codEd,':un'=>$inmueble];
			if($general->selectDataThree($consulta,$arrParam)){
				$forma = $general->getRegistros();
				if($forma['efectivo']== null){$forma['efectivo'] = 0;}
				if($forma['banco']== null){$forma['banco'] = 0;}
				if($forma['pagado']== null){$forma['pagado'] = 0;}
				if($forma['pagult']== null){$forma['pagult'] = 0;}
				//saldo anterior
				$salant = floatval($forma['efectivo']) + floatval($forma['banco']) - floatval($forma['pagado']);
				if($salant > 0){ //hay saldo anterior
					if(floatval($forma['efectivo'])>floatval($forma['banco'])){
						//saldo anterior efectivo
						$forant = 'dineroEfec';
					}elseif(floatval($forma['efectivo'])<floatval($forma['banco'])){
						// saldo anterior banco
						$forant = 'dineroBan';
					}
				}else{
					//no hay saldo anterior
					$forant = 'No';
				}
			}else{
				$forma = null;
			}
			// 4. Intereses y multas del edificio
			$consulta = "SELECT multa,interes FROM multas_intereses WHERE cod_edificio = :coe ORDER BY num DESC LIMIT 1";
			$arrParam=[':coe'=>$codEd];
			if($general->selectDataThree($consulta,$arrParam)){
				$mulInt = $general->getRegistros();
			}else{
				$mulInt = null;
			}
			//5. segun lo que tiene que es lo que puede pagar?
			if($debe != null && $tiene != null && $mulInt != null && $forma != null){
				$saldo = floatval($tiene['saldo']);
				$reApag = array(); //recibos que van a poder pagarse
				$cco = explode('-',$tiene['creada']);//usando la fecha de modificacion de propietarios
				$coCoPa = 'PROP'.$cco[0].$cco[1].$inmueble;
//echo json_encode($debe);
				foreach($debe as $index => $item){
					//4. la deuda esta vencida?
					$ve = date_create($item['vencimiento']);
					$hoy = date_create(date('Y-m-d'));
					$dif = date_diff($hoy,$ve)->format('%r%a');
					if($dif < 0){ //la deuda esta vencida
						$dMora = (-1)*$dif;
						$multa = floatval($mulInt['multa']);
						$int = floatval($mulInt['interes']);					
					}else{// la deuda no esta vencida
						$dMora = 0;
						$carInt = 0;
						$multa = 0;
						$int = 0;
					}
					$monto = floatval($item['monto']);
					$interes = $int*(0.01)*($monto)*($dMora/365);
					$aPagar = $monto + $multa + $interes;
					if($saldo >= $aPagar){
						$pago = $aPagar;
						$saldo -= $aPagar;
						$modo = 'Pago';
						$resta = 0;
						$flag = false;
					}else{
						$pago = $saldo;
						$saldo -= $saldo;
						$modo = 'Abono';
						$resta = $monto - $pago;
						$multa = 0; //la multa se cobra una vez por recibo, por eso se descuenta
						$flag = true;
					}
					
					//5. que forma de pago aplica este recibo..efectivo,cta banco o ambas. $forma
					/* se agota primero lo que habia anteriormente, sacamos %efectivo y % banco con el
					que se paga cada recibo. distribucion*/	
					if($salant <= $pago){
						$forpag = array($forant,$salant,$forma['formult'],$pago-$salant);
						$salant = 0;
					}else{
						$forpag = array($forant,$pago,$forma['formult'],0);
						$salant -= $pago;
					}
					$rec = array('Recibo'=>$item['control'],
								'Emision'=>$item['fecha'],
								'Vencimiento'=>$item['vencimiento'],
								'Monto' => $monto,
								'Mora'=>number_format($interes, 2, '.', ''), //intereses
								'Multa'=>$multa,
								'Total'=>number_format($pago, 2, '.', ''),
								'Modo'=> $modo,
								'CodReCo'=>$item['codigo'], //codigo del recibo de cobro
								'CoConfi'=>$coCoPa,  // codigo de confirmacion del pago
								'DiMor'=> $dMora, //dias de morosidad
								'tasInt'=>$int, //tasa de interes de mora
								'Resta'=> number_format($resta, 2, '.', ''),
								'ForPag'=>$forpag,
								'papfr'=>$item['papfr'],
								'prefr'=>$item['prefr'],
								'reserva'=>$item['reserva'],
								'provision'=>$item['provision'],
								'porpagar'=>$item['porpagar'],
								'montot'=>$item['montot']);  
					array_push($reApag,$rec);
					if($flag){break;}
				}
				/* 
				    $ctasAPagar viene del lado cliente y se va a comparar con $reAPag
					esta comparacion se hace para saber si lo que calculo el lado cliente
					coincide con lo que calculo el lado servidor
				*/
				$flag = false;
				foreach($reApag as $index => $item){
					if(isset($ctasAPagar[$index])){ //captura error por indice
						$recibo = $ctasAPagar[$index]->control;
						$mont = $ctasAPagar[$index]->monto;
						$carint = $ctasAPagar[$index]->carint;
						$mulpag = $ctasAPagar[$index]->mulpag;
						$totpag = $ctasAPagar[$index]->apagar;
					}else{
						$recibo = 'NO';
						$mont = 'NO';
						$carint = 'NO';
						$mulpag = 'NO';
						$totpag = 'NO';
					}
					if($item['Recibo'] != $recibo){$flag = true;break;}
					if($item['Monto'] != $mont){$flag = true;break;}
					if($item['Mora'] != $carint){$flag = true;break;}
					if($item['Multa'] != $mulpag){$flag = true;break;}
					if($item['Total'] != $totpag){$flag = true;break;}
				}
				if(count($reApag) != count($ctasAPagar)){$flag = true;}
				
				if($flag){
					echo json_encode(array("message" =>"Inconsistencia Cliente-Servidor",
									"response"=>"Discrepancia"));
					http_response_code(400);	
				}else{
					
					$contNumOne = 'controles_pagos_report';
					$contcolOne = 'cont_pag_rep';
					/* tabla de controles*/
					$consulta =  "SELECT ${contcolOne} FROM ${contNumOne} WHERE cod_edificio = :coe ORDER BY ${contcolOne} DESC LIMIT 1";
					$arrParam=[':coe'=>$codEd];
					$flagTwo = ($general->selectDataThree($consulta,$arrParam)) ? true : false;
					$numObt = $general->getRegistros();
					$error = $general->getInfoError();
					if($flagTwo && $error == null){if(empty($numObt)){$numObt["${contcolOne}"] = 0;}}else{$numObt = null;}
					if($numObt != null){
						$nueNu = intval($numObt["${contcolOne}"])+1;
						$arrQuery = array();
						$arrParam = array();
//RECIBOS DE PAGO REPORTADOS
						foreach($reApag as $index => $item){
							//1. cuanto pertenece al recibo?
							$montoRecibo = $item['Monto'];
							$consulta = "INSERT INTO pagos_reportados 
							SET cod_edificio = :coe,control = :ctr,codigo = :co,unidad = :un,fecha = :fec, cod_rec_cob = :crc,cod_con_pag = :crp,demora = :dem,multa = :mul,inter = :int,resta = :res,pagado = :pag,numero_acceso = :nuac";
							$arrParam = [":coe" => $codEd,
										 ":ctr" => $nueNu,
										 ":co" => 'REPO'.$ano.$mes.$inmueble,
										 ":un" => $inmueble,
										 ":fec" => $fecha,
										 ":crc" => $item['CodReCo'],
										 ":crp" => $item['CoConfi'],
										 ":dem" => $item['DiMor'],
										 ":mul" => $item['Multa'],
										 ":int" => $item['Mora'],
										 ":res" => $item['Resta'],
										 ":pag" => $montoRecibo,
										 ":nuac" => $numero_aceso];
							array_push($arrQuery,array($consulta,$arrParam));
							//2. cuanto es la multa + los intereses?
							$intRecibo = $item['Mora'];     // monto intereses
							$multRecibo = $item['Multa'];   //monto multa
							$atraRecibo = $item['DiMor'];   //dias de morosidad
							$taInRecibo =  $item['tasInt'];   //tasa de interes de mora
							$consulta = "INSERT INTO multa_int_cobrados SET cod_edificio = :coe,control = :ctr, codigo = :co,tipo_gasto = :tiga, unidad = :un, fecha = :fec,dias = :di, tasaInt = :tai,interes = :in, multa = :mul, numero_acceso = :nuac";
							$arrParam = [":coe" => $codEd,
										 ":ctr" => $nueNu,
										 ":co" => 'REPO'.$ano.$mes.$inmueble,
										 ":tiga" => '4.0.3-PIPRO',
										 ":un" => $inmueble,
										 ":fec" => $fecha,
										 ":di" => $atraRecibo,
										 ":tai" => $taInRecibo,
										 ":in" => $intRecibo,
										 ":mul"=> $multRecibo,
										 ":nuac" => $numero_aceso];
							array_push($arrQuery,array($consulta,$arrParam));			 
							//3. nuevo control de reporte de pagos			 		 
							$consulta = "INSERT INTO controles_pagos_report SET cod_edificio = :coe,cont_pag_rep = :ctr,numero_acceso = :nuac";
							$arrParam = [":coe" => $codEd,":ctr" => $nueNu,":nuac" => $numero_aceso];
							array_push($arrQuery,array($consulta,$arrParam));	
//REPARTO DE DINERO A LAS CUENTAS				
							$resAnt = $item['ForPag'][0];		//cta residente anterior
							$moReAn = $item['ForPag'][1];		// monto residente anterior   este
							$resAct = $item['ForPag'][2];		//cta residente actual
							$moReAc = $item['ForPag'][3];		//monto residente actual      este
							$ffre = $item['reserva']/$item['montot'];        //factor Fondo Reserva
							$fpro = $item['provision']/$item['montot'];	  //factor Provision
							$fcpp = $item['porpagar']/$item['montot'];		//factor cta por pagar 
							$facMuIn = $montoRecibo/($montoRecibo + $item['Mora']+$item['Multa']);  //factor de monto y multa Interes
				//1. el monto que este recibo cargara a la cuenta anterior> 0?
							if($moReAn > 0){
								$retFRe = $ffre*$moReAn;   //montos a retirar anterior para fondo reserva
								$retPro = $fpro*$moReAn;   //montos a retirar anterior para provisiones
								$retCPP = $fcpp*$moReAn;   //montos a retirar anterior para cuentas por pagar
								//a) cuanto va para el fondo de reserva de las multas e intereses?
								$monFRMI = (1-$facMuIn)*$moReAn;
								if($monFRMI > 0){
									//1) se retira el monto de la cuenta correspondiente 
									if($resAnt == 'dineroBan'){
										$tabla = 'dinero_en_bancos';
									}elseif($resAnt == 'dineroEfec'){
										$tabla = 'dinero_en_efectivo';
									}
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.3-PIPRO';
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,(-1)*$monFRMI,$code,$tiga,$numero_aceso));
									//2) deposito el monto al fondo de reserva
									$tabla = 'fondo_de_reserva';
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.3-PIPRO';
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,$monFRMI,$code,$tiga,$numero_aceso));
								}
								//b) cuanto va para el fondo de reserva del propio recibo sin multas e interes
								$mofrrec = $retFRe*$facMuIn; 
								if($mofrrec > 0){
									//1) retiro de la cuenta correspondiente
									if($resAnt == 'dineroBan'){
										$tabla = 'dinero_en_bancos';
									}elseif($resAnt == 'dineroEfec'){
										$tabla = 'dinero_en_efectivo';
									}
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO'; 
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,(-1)*$mofrrec,$code,$tiga,$numero_aceso));
									//2) deposito del monto al fondo de reserva
									$tabla = 'fondo_de_reserva';
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO';
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,$mofrrec,$code,$tiga,$numero_aceso));
								}
								//c) cuanto va para las provisiones del recibo sin multa e interes
								$mopro = $retPro*$facMuIn; 
								if($mopro > 0){
									//1) retiro de la cuenta correspondiente
									if($resAnt == 'dineroBan'){
										$tabla = 'dinero_en_bancos';
									}elseif($resAnt == 'dineroEfec'){
										$tabla = 'dinero_en_efectivo';
									}
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO'; 
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,(-1)*$mopro,$code,$tiga,$numero_aceso));
									//2) deposito del monto al fondo de provisiones
									$tabla = 'dinero_en_provisiones';
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO';
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,$mopro,$code,$tiga,$numero_aceso));
								}
								//d) cuanto va para las cuentas por pagar
								$moctapp = $retCPP*$facMuIn;
								if($moctapp > 0){
									//1) retiro de la cuenta correspondiente
									if($resAnt == 'dineroBan'){
										$tabla = 'dinero_en_bancos';
									}elseif($resAnt == 'dineroEfec'){
										$tabla = 'dinero_en_efectivo';
									}
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO'; 
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,(-1)*$moctapp,$code,$tiga,$numero_aceso));
									//2) deposito del monto al dinero para cuentas por pagar
									$tabla = 'dinero_ctasP_pagar';
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO';
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,$moctapp,$code,$tiga,$numero_aceso));
								}
							}
				//2.el monto que este recibo cargara a la cuenta actual> 0?			
							if($moReAc > 0){ //igual a la anterior
								$retFRe = $ffre*$moReAc;   //montos a retirar anterior para fondo reserva
								$retPro = $fpro*$moReAc;   //montos a retirar anterior para provisiones
								$retCPP = $fcpp*$moReAc;   //montos a retirar anterior para cuentas por pagar
								//a) cuanto va para el fondo de reserva de las multas e intereses?
								$monFRMI = (1-$facMuIn)*$moReAc;
								if($monFRMI > 0){
									//1) se retira el monto de la cuenta correspondiente 
									if($resAct == 'dineroBan'){
										$tabla = 'dinero_en_bancos';
									}elseif($resAct == 'dineroEfec'){
										$tabla = 'dinero_en_efectivo';
									}
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.3-PIPRO';
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,(-1)*$monFRMI,$code,$tiga,$numero_aceso));
									//2) deposito el monto al fondo de reserva
									$tabla = 'fondo_de_reserva';
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.3-PIPRO';
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,$monFRMI,$code,$tiga,$numero_aceso));
								}
								//b) cuanto va para el fondo de reserva del propio recibo sin multas e interes
								$mofrrec = $retFRe*$facMuIn; 
								if($mofrrec > 0){
									//1) retiro de la cuenta correspondiente
									if($resAct == 'dineroBan'){
										$tabla = 'dinero_en_bancos';
									}elseif($resAct == 'dineroEfec'){
										$tabla = 'dinero_en_efectivo';
									}
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO'; 
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,(-1)*$mofrrec,$code,$tiga,$numero_aceso));
									//2) deposito del monto al fondo de reserva
									$tabla = 'fondo_de_reserva';
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO';
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,$mofrrec,$code,$tiga,$numero_aceso));
								}
								//c) cuanto va para las provisiones del recibo sin multa e interes
								$mopro = $retPro*$facMuIn; 
								if($mopro > 0){
									//1) retiro de la cuenta correspondiente
									if($resAct == 'dineroBan'){
										$tabla = 'dinero_en_bancos';
									}elseif($resAct == 'dineroEfec'){
										$tabla = 'dinero_en_efectivo';
									}
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO'; 
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,(-1)*$mopro,$code,$tiga,$numero_aceso));
									//2) deposito del monto al fondo de provisiones
									$tabla = 'dinero_en_provisiones';
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO';
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,$mopro,$code,$tiga,$numero_aceso));
								}
								//d) cuanto va para las cuentas por pagar
								$moctapp = $retCPP*$facMuIn;
								if($moctapp > 0){
									//1) retiro de la cuenta correspondiente
									if($resAct == 'dineroBan'){
										$tabla = 'dinero_en_bancos';
									}elseif($resAct == 'dineroEfec'){
										$tabla = 'dinero_en_efectivo';
									}
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO'; 
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,(-1)*$moctapp,$code,$tiga,$numero_aceso));
									//2) deposito del monto al dinero para cuentas por pagar
									$tabla = 'dinero_ctasP_pagar';
									$code = 'REPO'.$ano.$mes.$inmueble;
									$tiga = '4.0.2-PAPRO';
									array_push($arrQuery,movDinero($tabla,$codEd,$fecha,$nueNu,$moctapp,$code,$tiga,$numero_aceso));
								}
							}
	//ACTUALIZACION DE CUENTAS		
							//1.cambio de status de ctas_por_cobrar y agregarle el correspondiente monto.
							$consulta = "UPDATE ctas_por_cobrar SET status = CASE WHEN (recib + :pag) < monto THEN 1 ELSE 2 END, recib = recib + :pag WHERE unidad = :un AND cod_edificio = :coe AND codigo = :co";
							$arrParam = [":pag"=>number_format($item['Total']*$facMuIn, 2, '.', ''),":un"=>$inmueble,":coe" => $codEd,":co"=>$item['CodReCo']];
							array_push($arrQuery,array($consulta,$arrParam));
							//2.cambio de status de recibos_cobro si es necesario y apuntar lo recibido
							$consulta = "UPDATE recibos_cobro SET status = CASE WHEN (recib + :pag) < monto  THEN 1 ELSE 2 END,recib = recib + :pag WHERE cod_edificio = :coe AND codigo = :co";
							$arrParam = [":pag"=>number_format($item['Total']*$facMuIn, 2, '.', ''),":coe" => $codEd,":co"=>$item['CodReCo']];
							array_push($arrQuery,array($consulta,$arrParam));
							//3. cambio del saldo en propietarios
							$consulta = "UPDATE propietarios SET saldo = saldo + :sal WHERE cod_edificio = :coe AND unidad = :un";
							$arrParam = [":sal"=> (-1)*$item['Total'],":coe" => $codEd,":un"=>$inmueble];
							array_push($arrQuery,array($consulta,$arrParam));
							$consulta = "UPDATE confirmacion_pagos SET status = 3 WHERE cod_edificio = :coe AND unidad = :un AND codigo = :co";
							$arrParam = [":coe" => $codEd,":un"=>$inmueble,':co'=>$item['CoConfi']];
							$nueNu++;  //numero de control de los recibos de cobro
							array_push($arrQuery,array($consulta,$arrParam));
						}
						/* transaction */
						if($general->dataTransactionInsert($arrQuery)){
							http_response_code(200);
							echo json_encode(array("message" =>"Success",
											"response"=>"Registro Exitoso"));
						}else{
							http_response_code(404); //The requested resource could not be found.
							echo json_encode(array("message" =>"Failed Five One",
										"response"=>$general->getInfoError()));
						}

					}else{
						http_response_code(400);
						echo json_encode(array("message" =>"Failed Three",
											"response"=>$general->getInfoError()));
					}		
				}
	
			}else{
				echo json_encode(array("message" =>"Fallo En La Conexion 1",
									"response"=>"Error"));
				http_response_code(400);
			}
		break;
		//END CASES
		}	
	}else{
		echo json_encode(array("message" =>"Fallo En La Conexion",
									"response"=>"NO Conecta"));
		http_response_code(500);
	}
}else{
	http_response_code(403); //Authorization Failed
	echo json_encode(array("message" =>"Authorization Failed Dos",
									"response"=>"NO Posee Permisos Dos"));
}
?>