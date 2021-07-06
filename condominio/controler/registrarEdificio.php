<?php
if($compParam == true && $normalPermission == true){
	$database = new Database();
	$db = $database->getConnection();
	$hoy = date("Y-m-d");
	$mes = date("m");
	$ano = date("Y");
	if($db != null){
		$general = new GeneralObject($db);
		$consultaEdif = "SELECT id_ed, nombre_edificio, direccion,estado,ciudad,telefono,correo FROM edificios ".  
						"INNER JOIN estados ON edificios.id_estado = estados.id_estado ".
						"INNER JOIN bd_pref_tel_ciudad ON edificios.id_ciudad = bd_pref_tel_ciudad.id_ciudad ".
						" WHERE cod_edificio = :coe LIMIT 0,1";
		$arrParamEdif=[':coe'=>$edificios['cod_edificio']];
		$general->selectDataThree($consultaEdif,$arrParamEdif);
		$numReg = $general->getNumRegistros();
		if($numReg > 0){
			http_response_code(500);
			echo json_encode(array("message" =>"El Recurso No Fue Ejecutado En El Nivel Cero",
									"response"=>"Problemas De Autorizacion"));
		}else{
//REGISTRO DEL EDIFICIO, DATOS GENERALES
			$arrQuery = array();
			$consulta = "INSERT INTO edificios SET cod_edificio = :coe,nombre_edificio = :nomEd,direccion = :dir,id_estado = :esta,id_ciudad = :ciud,telefono = :tele,correo = :corr,numero_acceso = :nuac";
			$arrParam = [':coe'=>$edificios['cod_edificio'],':nomEd'=>$edificios['nombre_edificio'],':dir'=>$edificios['direccion'],
							':esta'=>$edificios['id_estado'],':ciud'=>$edificios['id_ciudad'],':tele'=>$edificios['telefono'],
							':corr'=>$edificios['correo'],':nuac'=>$numero_aceso];
			array_push($arrQuery,array($consulta,$arrParam));
// REGISTRO DE LOS PROPIETARIOS DEL EDIFICIO
			$consulta = '';
			$arrParam = array();
			$consulta = "INSERT INTO propietarios(cod_propietario,cod_edificio,cuenta_propietario,unidad,alicuota,saldo,numero_acceso) VALUES ";

			for($i=1;$i<=count($propietarios);$i++){
				$consulta .=  "(:copro${i},:coed${i},:cuepro${i},:und${i},:alic${i},:sal${i},:nuac${i}),";
				$arrParam[":copro${i}"] = $propietarios[$i]['cod_propietario'];
				$arrParam[":coed${i}"] = $propietarios[$i]['codigo_edificio'];
				$arrParam[":cuepro${i}"] = $propietarios[$i]['cuenta_propietario'];
				$arrParam[":und${i}"] = $propietarios[$i]['unidad'];
				$arrParam[":alic${i}"] = $propietarios[$i]['alicuota']/100;
				$arrParam[":sal${i}"] = 0;
				$arrParam[":nuac${i}"] = $numero_aceso;
			}
			$consulta .= "(:copro${i},:coed${i},:cuepro${i},:und${i},:alic${i},:sal${i},:nuac${i});";
			$arrParam[":copro${i}"] = $edificios['cod_edificio']."-ADMIN-1";
			$arrParam[":coed${i}"] = $edificios['cod_edificio'];
			$arrParam[":cuepro${i}"] = $cedula;
			$arrParam[":und${i}"] = 'ADMIN';
			$arrParam[":alic${i}"] = 1;
			$arrParam[":sal${i}"] = 0;
			$arrParam[":nuac${i}"] = $numero_aceso;
			array_push($arrQuery,array($consulta,$arrParam));
			
// REGISTRO DE CUENTAS POR COBRAR 
			$consulta = '';
			$arrParam = array();	
			$consulta = "INSERT INTO ctas_por_cobrar (cod_edificio,status,control,codigo,tipo_gasto,fecha,monto,recib,unidad,concepto,vencimiento,nota,numero_acceso,creada) VALUES ";
			$codRecibo="COBRO${ano}${mes}000";
			$codCta='0.1.1-CPCPA';
			$nombCta = 'Propietarios Apertura';
			$totalCtaP = 0;
			for($i=1;$i<=count($ctas_por_cobrar);$i++){
				$consulta .= "(:coe${i},:st${i},:ctr${i},:co${i},:tiga${i},:fec${i},:mo${i},:re${i},:und${i},:con${i},:ven${i},:no${i},:nuac${i},:cre${i})";
				if($i == count($ctas_por_cobrar)){$consulta .= ';';}else{$consulta .= ',';}
				$arrParam[":coe${i}"] = $ctas_por_cobrar[$i]['cod_edificio'];
				$arrParam[":st${i}"] = 0;
				$arrParam[":ctr${i}"] = 0;
				$arrParam[":co${i}"] = $codRecibo;
				$arrParam[":tiga${i}"] = $codCta;
				$arrParam[":fec${i}"] = date("Y-m-d");
				$arrParam[":mo${i}"] = $ctas_por_cobrar[$i]['monto'];
				$arrParam[":re${i}"] = 0;
				$arrParam[":und${i}"] = $ctas_por_cobrar[$i]['unidad']; 
				$arrParam[":con${i}"] = 'Apertura Cobro';
				$arrParam[":ven${i}"] = date("Y-m-d");
				$arrParam[":no${i}"] = 'Cuenta Antes Del Sistema';
				$arrParam[":nuac${i}"] = $numero_aceso;
				$arrParam[":cre${i}"] = date('Y-m-d H:i:s');
				$totalCtaP = $totalCtaP + floatval($ctas_por_cobrar[$i]['monto']);
			}
			array_push($arrQuery,array($consulta,$arrParam));

// RECIBO CERO DE COBRO DE CONDOMINIO	
			$consulta = '';
			$arrParam = array();
			$consulta = "INSERT INTO recibos_cobro SET 
													cod_edificio = :coe,
													status = :st,
													control = :ctr, 
													codigo = :co,
													codigo_provision = :copro,
													fecha = :fec,
													vencimiento = :ven,
													desde = :des, 
													hasta = :has,
													papfr = :paf,
													prefr = :pre,
													pie = :pie,
													reserva = :res,
													provision = :pro, 
													porpagar = :ppag,
													monto = :mo,
													recib = :re,
													numero_acceso = :nuac,
													creada = :cre ";
				$arrParam = [":coe"=>$edificios['cod_edificio'],
							  ":st" => 0,
							  ":ctr" => 0,
							  ":co" => "COBRO${ano}${mes}000",
							  ":copro"=>"PROVI${ano}${mes}000",
							  ":fec"=>$hoy,
							  ":ven"=>$hoy,
							  ":des"=>$hoy,
							  ":has"=>$hoy,
							  ":paf"=>0,
							  ":pre"=>0,
							  ":pie"=>'Apertura del Sistema',
							  ":res"=>0,
							  ":pro"=>0,
							  ":ppag"=>0,
							  ":mo"=>$totalCtaP,
							  ":re"=> 0,
							  ":nuac"=>$numero_aceso,
							  ":cre"=>date('Y-m-d H:i:s')];
				array_push($arrQuery,array($consulta,$arrParam));
						
// REGISTRO DE LA CUENTA EN BANCOS
			$consulta = '';
			$arrParam = array();
			$consulta = "INSERT INTO dinero_en_bancos SET cod_edificio = :coe,fecha = :fec,recibo_numero = :renu,monto = :mon,codigo_cpcp = :cpcp, cod_cta = :cocu,numero_acceso = :nuac";
			$arrParam = [':coe'=>$edificios['cod_edificio'],':fec'=>date("Y-m-d"),':renu'=>0,
							':mon'=>$dinero['dineroBan'],':cpcp'=>"COBRO${ano}${mes}000",':cocu'=>'0.1.2-DIBAP',':nuac'=>$numero_aceso];
			array_push($arrQuery,array($consulta,$arrParam));				
// REGISTRO DE DINERO EN EFECTIVO							
			$consulta = '';
			$arrParam = array();					
			$consulta = "INSERT INTO dinero_en_efectivo SET cod_edificio = :coe,fecha = :fec,recibo_numero = :renu,monto = :mon,codigo_cpcp = :cpcp,cod_cta = :cocu,numero_acceso = :nuac";
			$arrParam = [':coe'=>$edificios['cod_edificio'],':fec'=>date("Y-m-d"),':renu'=>0,
							':mon'=>$dinero['dineroEfec'],':cpcp'=>"COBRO${ano}${mes}000",':cocu'=>'0.1.3-DIEAP',':nuac'=>$numero_aceso];
			array_push($arrQuery,array($consulta,$arrParam));					
// REGISTRO DE DINERO EN FONDO DE RESERVA							
			$consulta = '';
			$arrParam = array();									
			$consulta = "INSERT INTO fondo_de_reserva SET cod_edificio = :coe,fecha = :fec,recibo_numero = :renu,monto = :mon,codigo_cpcp = :cpcp,cod_cta = :cocu,numero_acceso = :nuac";
			$arrParam = [':coe'=>$edificios['cod_edificio'],':fec'=>date("Y-m-d"),':renu'=>0,':mon'=>$dinero['fondoR'],':cpcp'=>"COBRO${ano}${mes}000",':cocu'=>'0.1.4-DIFRE',':nuac'=>$numero_aceso];
			array_push($arrQuery,array($consulta,$arrParam));
// REGISTRO DE DINERO EN PROVISIONES
			$consulta = '';
			$arrParam = array();
			$consulta = "INSERT INTO dinero_en_provisiones SET cod_edificio = :coe,
															fecha = :fec,
															recibo_numero = :renu,
															monto = :mon,
															codigo_cpcp = :cpcp,
															cod_cta = :cocu,
															numero_acceso = :nuac";
			$arrParam = [':coe'=>$edificios['cod_edificio'],
							 ':fec'=>date("Y-m-d"),
							 ':renu'=>0,
							 ':mon'=>$dinero['ctappro'],
							 ':cpcp'=>"COBRO${ano}${mes}000",
							 ':cocu'=>'0.1.6-PROAP',
							 ':nuac'=>$numero_aceso];
			array_push($arrQuery,array($consulta,$arrParam));				 
// REGISTRO DE LAS CUENTAS POR PAGAR
			$consulta = '';
			$arrParam = array();
			$consulta = "INSERT INTO cuentas_por_pagar SET cod_edificio = :coe,status = :st,control = :ctr, codigo = :co,tipo_gasto = :tiga,fecha = :fec,monto = :mo,rif = :ri,concepto = :con,vencimiento = :ven,nota = :no, numero_acceso = :nuac,creada = :cre";	
			
			$arrParam = [':coe'=>$edificios['cod_edificio'],
							 ':st'=>0,
							 ':ctr'=>0,
							 ':co'=>"COBRO${ano}${mes}000",
							 ':tiga'=>'0.1.5-CPPAP',
							 ':fec'=>date("Y-m-d"),
							 ':mo'=>$dinero['ctappag'],
							 ':ri'=>'J-000000000',
							 ':con'=>'Cta Por Pagar Iniciando La Contabilidad',
							 ':ven'=>30,
							 ':no'=>'Inicio Cuentas',
							 ':nuac'=>$numero_aceso,
							 ':cre'=>date('Y-m-d H:i:s')];
			array_push($arrQuery,array($consulta,$arrParam));	
			
// PROVISIONES AL REGISTRAR EL EDIFICIO
			$consulta = '';
			$arrParam = array();
			$consulta = "INSERT INTO provisiones SET cod_edificio = :coe,
														  status = :st,
														  control = :ctr, 
														  codigo = :co,
														  tipo_gasto = :tiga,
														  fecha = :fec,
														  monto = :mo,
														  usado = :us,
														  concepto = :con,
														  numero_acceso = :nuac,
														  creada = :cre";					 
							 
			$arrParam = [':coe'=>$edificios['cod_edificio'],
							 ':st'=>0,
							 ':ctr'=>0,
							 ':co'=>"PROVI${ano}${mes}000",
							 ':tiga'=>'0.1.6-PROAP',
							 ':fec'=>date("Y-m-d"),
							 ':mo'=>$dinero['ctappro'],
							 ':us'=>0,
							 ':con'=>'Cta Provisiones Iniciando La Contabilidad',
							 ':nuac'=>$numero_aceso,
							 ':cre'=>date('Y-m-d H:i:s')];
			array_push($arrQuery,array($consulta,$arrParam));		 
//REGISTRO DE LA JUNTA DE CONDOMINIO
			$consulta = '';
			$arrParam = array();
			$consulta = "INSERT INTO junta_de_condominio(cod_edificio,cargo,unidad,representante,periodo,duracion,inicio,numero_acceso) VALUES ";
			for($i=1;$i<=count($cargoCond);$i++){
				$consulta .="(:coed${i},:car${i},:und${i},:rep${i},:per${i},:dur${i},:ini${i},:nuac${i})";
				if($i == count($cargoCond)){$consulta .=";";}else{$consulta .=",";}
				$arrParam[":coed${i}"] = $edificios['cod_edificio'];
				$arrParam[":car${i}"] = $cargoCond[$i];
				$arrParam[":und${i}"] = 'ADMIN-0';
				$arrParam[":rep${i}"] = 'V-00000000';
				$arrParam[":per${i}"] = 0;
				$arrParam[":dur${i}"] = $duracion;
				$arrParam[":ini${i}"] = date("Y-m-d");
				$arrParam[":nuac${i}"] = $numero_aceso;	
			}
			array_push($arrQuery,array($consulta,$arrParam));
//REGISTRO DE MULTAS E INTERESES
			$consulta = '';
			$arrParam = array();
			$consulta = "INSERT INTO multas_intereses SET cod_edificio = :coe,fecha = :fec,num = 0,multa = 0, interes =0,numero_acceso = :nuac";
			$arrParam = [':coe'=>$edificios['cod_edificio'],':fec'=>date("Y-m-d"),':nuac'=>$numero_aceso];
			array_push($arrQuery,array($consulta,$arrParam));
// PROVEEDOR CERO
			$consulta = '';
			$arrParam = array();
			$consulta = "INSERT INTO proveedores SET cod_edificio = :coe,rif = :ri, nombre = :name,direccion = :address, id_estado = :st, id_ciudad = :city,telefono = :phone, actividad = :act, contacto = :cont, correo = :email";
			$arrParam=[':coe'=>$edificios['cod_edificio'],
					   ':ri'=>'J-000000000',
					   ':name'=>'Proveedores Anteriores',
					   ':address'=>$edificios['direccion'],
					   ':st'=>$edificios['id_estado'],
					   ':city'=>$edificios['id_ciudad'],
					   ':phone'=>$edificios['telefono'],
					   ':act'=>'ac-31',
					   ':cont'=>'Administrador del Edificio',
					   ':email'=>'edificio@dominio.com'];	
			array_push($arrQuery,array($consulta,$arrParam));	
// TRANSACCION
			if($general->dataTransactionInsert($arrQuery)){
				http_response_code(200);
				echo json_encode(array("message" =>"Success",
									"response"=>"Registro Exitoso"));
			}else{
				http_response_code(404); //The requested resource could not be found.
				echo json_encode(array("message" =>"El Recurso No Fue Ejecutado En El Primer Nivel",
									"response"=>$general->getInfoError()));
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