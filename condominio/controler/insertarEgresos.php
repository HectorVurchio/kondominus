<?php
/*  
	el codigo a utilizar para los egresos con el fin de relacionarlos con el recibo
	de cobro sera EGRESO(ANO)(MES), POR EJEMPLO = EGRESO202102.
	caso donde no hay provisiones
		estatus 0 = egresos para reflejar en proximos recibos de cobro;
		estatus 1 = egresos para reflejar en proximos recibos de cobro pero no se cargaran. gastos ejecutados;
		estatus 2 = egresos que no se van a reflejar en proximos recibos de cobro
	caso donde hay provisiones
		status 1: Corresponde a las Provisiones que ya fueron ejecutadas y gastado su dinero en su totalidad. se relacionaran en el proximo periodo para informar.
		status 2: Corresponde a las provisiones presentadas cuyo status anterior fue 0;
		status 3: Corresponde a las provisiones presentadas cuyo status anterior fue 1;

*/
function getTablaSt($formaPago){
	switch($formaPago){
		case 'dineroBan':
				$tabla = 'dinero_en_bancos';
				$st = 0;
				$chkAcc = true;
				break;
		case 'dineroEfec':
				$tabla = 'dinero_en_efectivo';
				$st = 0;
				$chkAcc = true;
				break;
		case 'fondoR':
				$tabla = 'fondo_de_reserva';
				$st = 0;
				$chkAcc = true;
				break;
		case 'dineroProv':
				$tabla = 'dinero_en_provisiones';
				$st = 1;
				$chkAcc = true;
				break;
		case 'credito':
			$tabla = null;
			$st = 0;
			$chkAcc = false;
			break;
		default:
			$tabla = null; //no hay consulta de cuentas
			$st = '';
			$chkAcc = false;
	}
	return array($tabla,$st,$chkAcc);
}

function reciboExedenteProvision($codEd,$contcolOne,$contNumOne){
	$database = new Database();
	$db = $database->getConnection();
	$general = new GeneralObject($db);
	$consulta =  "SELECT ${contcolOne} FROM ${contNumOne} WHERE cod_edificio = :coe ORDER BY ${contcolOne} DESC LIMIT 1";
	$arrParam=[':coe'=>$codEd];
	if($general->selectDataThree($consulta,$arrParam)){
		$numero = $general->getRegistros()["${contcolOne}"];			
	}else{
		$numero = 0;			
	}
	return $numero;
}

if($adminPermission && $compParam){
	$database = new Database();
	$db = $database->getConnection();
	$fechaDos=explode('-',date("Y-m-d"));
	$ano=$fechaDos[0];
	$mes=$fechaDos[1];
	$codigo="EGRESO${ano}${mes}";
	$single = false;
	$multiple = false;
	$chkAcc = false;
	$general = new GeneralObject($db);
	$chequeado = false; /* revision inicial de fondos */
	$arrQuery = array();	
	
	switch($operacion){
		case 'simple':  /* una cuenta cubre todo*/
			$single = true;
			break;
		case 'combinada':
			$multiple = true;
			break;
	}
		
	switch($formular){
		case 'facturas_resumen':
			$contNumOne = 'controles_facturas_egresos';
			$contcolOne = 'cont_fac_pag';
			$codigo="FACTURAS${ano}${mes}";     
			$consultaUno = "INSERT INTO facturas_egresos SET cod_edificio = :coe,status = :st,control = :ctr, codigo = :co,tipo_gasto = :tiga,fecha = :fec,exento = :exe,iva = :iv,base_imponible = :bai,monto = :mo,rif = :ri,tipo_pago = :tipa,referencia = :re,fac_numero = :fanu,concepto = :con,numero_acceso = :nuac,creada = :cre";
			$arrParamUno=[':coe'=>$codEd,':st'=>0,':ctr'=>0,':co'=>$codigo,':tiga'=>$tipoGasto,':fec'=>$fecha,':exe'=>$excento,':iv'=>$iva,':bai'=>$baseImp,':mo'=>$total,':ri'=>$rif,':tipa'=>$formaPago,':re'=>$referencia,':fanu'=>$factura,':con'=>$concepto,':nuac'=>$numero_aceso,':cre'=>date('Y-m-d H:i:s')];
		break;
		
		case 'recibos_resumen':
			$contNumOne = 'controles_recibos_egresos';
			$contcolOne = 'cont_rec_pago';
			$codigo="RECIBOS${ano}${mes}"; 
			$consultaUno = "INSERT INTO recibos_egresos SET cod_edificio = :coe,status = :st,control = :ctr, codigo = :co,tipo_gasto = :tiga,fecha = :fec,monto = :mo,rif = :ri,tipo_pago = :tipa,referencia = :re,concepto = :con,nota = :no,numero_acceso = :nuac,creada = :cre";
			$arrParamUno = [':coe'=>$codEd,':st'=>0,':ctr'=>0,':co'=>$codigo,':tiga'=>$tipoGasto,':fec'=>$fecha,':mo'=>$total,':ri'=>$rif,':tipa'=>$formaPago,':re'=>$referencia,':con'=>$concepto,':no'=>$nota,':nuac'=>$numero_aceso,':cre'=>date('Y-m-d H:i:s')];
		break;
		
		case 'nomina_mes':
			$contNumOne = 'controles_recibos_nomina';
			$contcolOne = 'cont_rec_nomina';
			$codigo="NOMINA${ano}${mes}";		 
			$consultaUno = "INSERT INTO recibos_egresos_nomina SET cod_edificio = :coe,status = :st,control = :ctr, codigo = :co,tipo_gasto = :tiga,fecha = :fec,monto = :mo,cedula = :ce,tipo_pago = :tipa,referencia = :re,concepto = :con,nota = :no,numero_acceso = :nuac,creada = :cre";
			$arrParamUno = [':coe'=>$codEd,':st'=>0,':ctr'=>0,':co'=>$codigo,':tiga'=>$tipoGasto,':fec'=>$fecha,':mo'=>$total,':ce'=>$rif,':tipa'=>$formaPago,':re'=>$referencia,':con'=>$concepto,':no'=>$nota,':nuac'=>$numero_aceso,':cre'=>date('Y-m-d H:i:s')];
		break;
		
		case 'comision_banco':
			$contNumOne = 'controles_comisiones_bancarias';
			$contcolOne = 'cont_com_pag';
			$codigo="COBANCAR${ano}${mes}";
			$consultaUno = "INSERT INTO comisiones_bancarias SET cod_edificio = :coe,status = :st,control = :ctr,codigo = :co,tipo_gasto = :tiga,fecha = :fec,monto = :mo,banco = :ban,tipo_pago = :tipa,referencia = :re,nota = :no,numero_acceso = :nuac,creada = :cre";
			$arrParamUno = [':coe'=>$codEd,':st'=>0,':ctr'=>0,':co'=>$codigo,':tiga'=>$tipoGasto,':fec'=>$fecha,':mo'=>$total,':ban'=>$banco,':tipa'=>$formaPago,':re'=>$referencia,':no'=>$nota,':nuac'=>$numero_aceso,':cre'=>date('Y-m-d H:i:s')];
		break;
		
		case 'cuentas_pagar':
		//no hay consulta de cuentas
			$contNumOne = 'controles_ctasppagar_egresos';
			$contcolOne = 'cont_cta_pagar';
			$codigo="CTAPAGAR${ano}${mes}";	 
			$consultaUno = "INSERT INTO cuentas_por_pagar SET cod_edificio = :coe,status = :st,control = :ctr, codigo = :co,tipo_gasto = :tiga,fecha = :fec, monto = :mo, rif = :ri,concepto = :con,vencimiento = :ven,nota = :no, numero_acceso = :nuac,creada = :cre";	
			$arrParamUno = [':coe'=>$codEd,':st'=>0,':ctr'=>0,':co'=>$codigo,':tiga'=>$tipoGasto,':fec'=>$fecha,':mo'=>$total,':ri'=>$rif,':con'=>$concepto,':ven'=>$vencimiento,':no'=>$nota,':nuac'=>$numero_aceso,':cre'=>date('Y-m-d H:i:s')];	
		break;
	}
	
	if($db != null){
		if($single){ 
			$tabYst = getTablaSt($formaPago);
			$tabla = $tabYst[0];
			$st = $tabYst[1];
			if($tabYst[2]){//no credito, se chequea cuenta
				/* tabla de la cuenta */
				$consulta = "SELECT ROUND(SUM(monto),2) AS monto FROM ${tabla} WHERE cod_edificio = :coe";
				$arrParam=[':coe'=>$codEd];
				if($general->selectDataThree($consulta,$arrParam)){
					$disponible = $general->getRegistros();
					if((double)$disponible['monto'] >= (double)$total){
						$chequeado = true;
					}else{
						$chequedo = false; //no hay fondos en la cuenta
					}
				}else{
					$chequeado = false; //error
				}	
			}
			/* tabla de controles*/
			$consulta =  "SELECT ${contcolOne} FROM ${contNumOne} WHERE cod_edificio = :coe ORDER BY ${contcolOne} DESC LIMIT 1";
			$arrParam=[':coe'=>$codEd];
			$flagTwo = ($general->selectDataThree($consulta,$arrParam)) ? true : false;
			$numObt = $general->getRegistros();
			$error = $general->getInfoError();
			if($flagTwo && $error == null){if(empty($numObt)){$numObt["${contcolOne}"] = 0;}}else{$numObt = null;}
			if($numObt != null){
				$nueNu = intval($numObt["${contcolOne}"])+1;
				$st = $tabYst[1];
				$arrParamUno[':ctr'] = $nueNu;	
				$arrParamUno[':st'] = $st;
				array_push($arrQuery,array($consultaUno,$arrParamUno));
				/* tabla de controles*/
				$consultaDos = "INSERT INTO ${contNumOne} SET cod_edificio = :coe, ${contcolOne} = :crp, numero_acceso = :nuac";
				$arrParamDos = [':coe'=>$codEd,':crp'=>$nueNu,':nuac'=>$numero_aceso];
				array_push($arrQuery,array($consultaDos,$arrParamDos));
				/* cambio en las cuentas */
				if($tabYst[2] == true && $chequeado == false){//no hay fondos en la cuenta
					http_response_code(400);
					echo json_encode(array("message" =>"Failed Two: Fondo Insuficiente",
									"response"=>$general->getInfoError()));
				}else{
					if($tabla != null){//el pago fue de contado
						/* tabla de la cuenta */
						$consultaTres = "INSERT INTO ${tabla} SET cod_edificio = :coe,fecha = :fec,recibo_numero = :renu, monto = :mon,codigo_cpcp = :cpcp,cod_cta = :cocu,numero_acceso = :nuac";
						$arrParamTres = [':coe'=>$codEd,':fec'=>$fecha,':renu'=>$nueNu,':mon'=>(-1)*$total,':cpcp'=>$codigo,':cocu'=>$tipoGasto,':nuac'=>$numero_aceso];
						array_push($arrQuery,array($consultaTres,$arrParamTres));
					}
					//actualizacion del estatus de provisiones
					if($tabla == 'dinero_en_provisiones'){
						$consultaCuatro = "UPDATE provisiones SET status = CASE WHEN usado + :mon < monto  THEN 0 ELSE 1 END,usado = usado + :mon WHERE cod_edificio = :coe AND tipo_gasto = :tiga AND control = :prc";
						$arrParamCuatro = [':st'=>$st2,':mon'=>$total,':coe'=>$codEd,':tiga'=>$tipoGasto,':prc'=>$provcont];
						array_push($arrQuery,array($consultaCuatro,$arrParamCuatro));
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
				}			
			}else{
				http_response_code(400);
				echo json_encode(array("message" =>"Failed Three",
									"response"=>$general->getInfoError()));
			}
		}
		if($multiple){
			// chequeo de fondos en las cuentas
			$texto = 'no iniciado';
			foreach($formaPagoDos as $item){ 
				$tabYst = getTablaSt($item[0]);
				$tabla = $tabYst[0];
				$consulta = "SELECT ROUND(SUM(monto),2) AS monto FROM ${tabla} WHERE cod_edificio = :coe";
				$arrParam=[':coe'=>$codEd];
				if($general->selectDataThree($consulta,$arrParam)){
					$disponible = $general->getRegistros();
					if((double)$disponible['monto'] >= (double)$item[2]){
						$chequeado = true;
						$texto = 'Sin Problemas';
					}else{
						$chequeado = false; //no hay fondos en la cuenta
						$texto = "La cuenta ${item[1]} no dispone de fondos"; 
						break;
					}
				}else{
					$chequeado = false; //error
					$texto = "La cuenta ${item[1]} no pudo entrar";
					break;
				}	
			}
			
			/* tabla de controles*/
			$consulta =  "SELECT ${contcolOne} FROM ${contNumOne} WHERE cod_edificio = :coe ORDER BY ${contcolOne} DESC LIMIT 1";
			$arrParam=[':coe'=>$codEd];
			$flagTwo = ($general->selectDataThree($consulta,$arrParam)) ? true : false;
			$numObt = $general->getRegistros();
			$error = $general->getInfoError();
			if($flagTwo && $error == null){if(empty($numObt)){$numObt["${contcolOne}"] = 0;}}else{$numObt = null;}
			if($numObt != null){
				$nueNu = intval($numObt["${contcolOne}"])+1;
				$st = $tabYst[1];
				$arrParamUno[':ctr'] = $nueNu;	
				$arrParamUno[':st'] = $st;
				array_push($arrQuery,array($consultaUno,$arrParamUno));
				
				/* tabla de controles*/
				$consultaDos = "INSERT INTO ${contNumOne} SET cod_edificio = :coe, ${contcolOne} = :crp, numero_acceso = :nuac";
				$arrParamDos = [':coe'=>$codEd,':crp'=>$nueNu,':nuac'=>$numero_aceso];
				array_push($arrQuery,array($consultaDos,$arrParamDos));
				/* cambio en las cuentas */
				if($chequeado == false){//no hay fondos en alguna cuenta
					http_response_code(400);
					echo json_encode(array("message" =>"Failed Two: ${texto}",
									"response"=>$general->getInfoError()));
				}else{
					/* tablas de las cuentas */
					foreach($formaPagoDos as $it){ 
						$tabYst = getTablaSt($it[0]);
						$tabla = $tabYst[0];
						//actualizacion del estatus y monto utilizado de provisiones
						if($tabla == 'dinero_en_provisiones'){
							$codigo="RECIBOS${ano}${mes}"; //va a ser un recibo
							$consultaCuatro = "UPDATE provisiones SET status = CASE WHEN usado + :mon < monto  THEN 0 ELSE 1 END, usado = usado + :mon WHERE cod_edificio = :coe AND tipo_gasto = :tiga AND control = :prc";						
							$arrParamCuatro = [':mon'=>$usadoProv,':coe'=>$codEd,':tiga'=>$tipoGasto,':prc'=>$provcont];
							array_push($arrQuery,array($consultaCuatro,$arrParamCuatro));
							// recibo de complemento
							if($formular == 'recibos_resumen'){
							   $newCon = intval($nueNu) + 1;
							}else{
								$ultN = reciboExedenteProvision($codEd,'cont_rec_pago','controles_recibos_egresos');
								$newCon = intval($ultN) + 1;
							}
							$consulta5 = "INSERT INTO controles_recibos_egresos SET cod_edificio = :coe, cont_rec_pago = :crp, numero_acceso = :nuac";
							$arrParam5 = [':coe'=>$codEd,':crp'=>$newCon,':nuac'=>$numero_aceso];
							array_push($arrQuery,array($consulta5,$arrParam5));
							$anot = "Complemento de Pago de la Provision ${provcont}";
							$consulta6 = "INSERT INTO recibos_egresos SET cod_edificio = :coe,status = :st,control = :ctr, codigo = :co,tipo_gasto = :tiga,fecha = :fec,monto = :mo,rif = :ri,tipo_pago = :tipa,referencia = :re,concepto = :con,nota = :no,numero_acceso = :nuac,creada = :cre";
							$arrParam6 = [':coe'=>$codEd,':st'=>0,':ctr'=>$newCon,':co'=>$codigo,':tiga'=>$tipoGasto,':fec'=>$fecha,':mo'=>$falta,':ri'=>$rif,':tipa'=>$formaPago,':re'=>$referencia,':con'=>$concepto,':no'=>$anot,':nuac'=>$numero_aceso,':cre'=>date('Y-m-d H:i:s')];							
							array_push($arrQuery,array($consulta6,$arrParam6));	
						}	
						$consultaTres = "INSERT INTO ${tabla} SET cod_edificio = :coe,fecha = :fec,recibo_numero = :renu,monto = :mon,codigo_cpcp = :cpcp,cod_cta = :cocu,numero_acceso = :nuac";
						$arrParamTres = [':coe'=>$codEd,':fec'=>$fecha,':renu'=>$nueNu,':mon'=>(-1)*$it[2],':cpcp'=>$codigo,':cocu'=>$tipoGasto,':nuac'=>$numero_aceso];
						array_push($arrQuery,array($consultaTres,$arrParamTres));
					}
					/* transaction */
					if($general->dataTransactionInsert($arrQuery)){
						http_response_code(200);
						echo json_encode(array("message" =>"Success",
									"response"=>"Registro Exitoso"));
					}else{
						http_response_code(404); //The requested resource could not be found.
						echo json_encode(array("message" =>"Failed Five",
									"response"=>$general->getInfoError()));
					}
				}			
			}else{
				http_response_code(400);
				echo json_encode(array("message" =>"Failed Three",
									"response"=>$general->getInfoError()));
			}
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
