<?php
/*Objetos En Caso Se No Encontrarse Datos*/
function createObject($arrKey){
	$nomVar = new stdClass;
	foreach($arrKey as $key => $value){
		$nomVar->$value = '0';
	}
	return $nomVar;
}
function retrieve($obj,$consulta,$arrParam,$arrEmp){
	if($obj->selectDataOne($consulta,$arrParam)){
		if($obj->getNumRegistros()>0){
			$searRS = $obj->getRegistros();
		}else{
			$empResSet = createObject($arrEmp);
			$searRS = array($empResSet);
		}	
	}else{
		$empResSet = createObject($arrEmp);
		$searRS = array($empResSet);
	}
	return $searRS;
}
/* Hasta Aqui Los Objetos*/

if($adminPermission && $compParam){
	$database = new Database();
	$db = $database->getConnection();
	$ano=date('Y');
	$mes=date('m');
	if($db != null){
//CONSULTA DE LOS DATOS DEL EDIFICIO 
		$general = new GeneralObject($db);
		$consulta = "SELECT id_ed, nombre_edificio, direccion,estado,ciudad,telefono,correo FROM edificios ". 
		"INNER JOIN estados ON edificios.id_estado = estados.id_estado ".
		"INNER JOIN bd_pref_tel_ciudad ON edificios.id_ciudad = bd_pref_tel_ciudad.id_ciudad ".
		"WHERE cod_edificio = :coe LIMIT 0,1";
		$arrParam=[':coe'=>$codEd];
		$arrEmp = ['id_ed','nombre_edificio','direccion','estado','ciudad','telefono','correo'];
		$edifResSet = retrieve($general,$consulta,$arrParam,$arrEmp);
//CONSULTA DE LAS UNIDADES DEL EDIFICIO
		$consulta = "SELECT id_prop,unidad,cuenta_propietario,usuarios.Nombre,usuarios.Apellido,usuarios.Correo, alicuota,TRUNCATE(saldo,2) AS saldo ".
		"FROM propietarios LEFT JOIN usuarios ON propietarios.cuenta_propietario = usuarios.Cedula ".
		"WHERE cod_edificio = :coe AND NOT unidad = 'ADMIN' ORDER BY id_prop";
		$arrParam=[':coe'=>$codEd];
		$arrEmp = ['unidad','cuenta_propietario','Nombre','Apellido','Correo','alicuota'];
		$unidResSet = retrieve($general,$consulta,$arrParam,$arrEmp);
//CONSULTA DE LOS ADMINISTRADORES
		$consulta = "SELECT id_prop,cuenta_propietario,cod_propietario, usuarios.Nombre, ".
					"usuarios.Apellido, usuarios.Correo ".
					"FROM propietarios INNER JOIN usuarios ON propietarios.cuenta_propietario ".
					"= usuarios.Cedula WHERE unidad = 'ADMIN' AND cod_edificio = :coe";
		$arrParam =[':coe'=>$codEd];
		$arrEmp = ['cuenta_propietario','cod_propietario','Nombre','Apellido','Correo'];
		$admResSet = retrieve($general,$consulta,$arrParam,$arrEmp);
//CONSULTA DE LA JUNTA DE CONDOMINIO
		$consulta = 'SELECT DISTINCT periodo FROM junta_de_condominio WHERE cod_edificio = :coe ORDER BY inicio DESC LIMIT 1';
		$arrParam = [':coe'=>$codEd];
		if($general->selectDataThree($consulta,$arrParam)){
			$reg = $general->getRegistros();
			$consulta =  "SELECT junta_de_condominio.id,cargo,unidad,representante,inicio,duracion,usuarios.Nombre,usuarios.Apellido,usuarios.Correo FROM junta_de_condominio LEFT JOIN usuarios ON junta_de_condominio.representante = usuarios.Cedula WHERE junta_de_condominio.cod_edificio = :coe AND junta_de_condominio.periodo= :per"; 
			$arrParam=[':coe'=>$codEd,':per'=>intval($reg['periodo'])];
			$arrEmp = ['id','cargo','unidad','representante','inicio','duracion','nombre','apellido','correo'];
			$juntResSet = retrieve($general,$consulta,$arrParam,$arrEmp);
		}else{
			$empJRSet = createObject(['id','cargo','unidad','representante','inicio','duracion','nombre','apellido','correo']);
			$juntResSet = array($empJRSet);
		}
//FACTURAS PAGADAS
		$consulta = "SELECT control,
							tipo_gasto AS aTip_gas,
							cuentas_contabilidad.nombre_cta AS bNombCta,
							SUM(monto) AS cMonto FROM facturas_egresos INNER JOIN cuentas_contabilidad ON facturas_egresos.tipo_gasto = cuentas_contabilidad.cod_cta WHERE cod_edificio = :coe AND status = :st GROUP BY tipo_gasto ORDER BY tipo_gasto";
		$arrParam=[':coe'=>$codEd,':st'=>0];
		$arrEmp = ['control','aTip_gas','bNombCta','cMonto'];
		$facPagad = retrieve($general,$consulta,$arrParam,$arrEmp);			
			
//RECIBOS PAGADOS
		$consulta = "SELECT control,
							tipo_gasto AS aTip_gas,
							cuentas_contabilidad.nombre_cta AS bNombCta,
							SUM(monto) AS cMonto FROM recibos_egresos INNER JOIN cuentas_contabilidad ON recibos_egresos.tipo_gasto = cuentas_contabilidad.cod_cta WHERE cod_edificio = :coe AND status = :st GROUP BY tipo_gasto ORDER BY tipo_gasto";
		$arrParam=[':coe'=>$codEd,':st'=>0];
		$arrEmp = ['control','aTip_gas','bNombCta','cMonto'];
		$recPagad = retrieve($general,$consulta,$arrParam,$arrEmp);
		
//CUENTAS POR PAGAR
		$consulta = "SELECT control,
							tipo_gasto AS aTip_gas,
							cuentas_contabilidad.nombre_cta AS bNombCta,
							SUM(monto) AS cMonto FROM cuentas_por_pagar INNER JOIN cuentas_contabilidad ON cuentas_por_pagar.tipo_gasto = cuentas_contabilidad.cod_cta WHERE cod_edificio = :coe AND status = :st GROUP BY tipo_gasto ORDER BY tipo_gasto";
		$arrParam=[':coe'=>$codEd,':st'=>0];
		$arrEmp = ['control','aTip_gas','bNombCta','cMonto'];
		$facPend = retrieve($general,$consulta,$arrParam,$arrEmp);
// EMPLEADOS DEL EDIFICIO
		$consulta = "SELECT cedula AS acedula ,nombre AS bNombre,direccion AS cDireccion,estado AS dEstado,".
		"ciudad AS eCiudad,telefono AS fTelefono,actividad AS gActividad,sueldo AS hSueldo FROM empleados ".
		"INNER JOIN estados ON empleados.id_estado = estados.id_estado ".
		"INNER JOIN bd_pref_tel_ciudad ON empleados.id_ciudad = bd_pref_tel_ciudad.id_ciudad  ".		
		"WHERE cod_edificio = :coe";
		$arrParam=[':coe'=>$codEd];
		$arrEmp = ['acedula','bNombre','cDireccion','dEstado','eCiudad','fTelefono','gActividad','hSueldo'];
		$empEdif = retrieve($general,$consulta,$arrParam,$arrEmp);
// NOMINA MES ACTUAL DEL EDIFICIO
		$consulta = "SELECT control,
							tipo_gasto as aTip_gas,
							cuentas_contabilidad.nombre_cta AS bNombCta,
							SUM(monto) AS cMonto
							FROM recibos_egresos_nomina INNER JOIN cuentas_contabilidad ON recibos_egresos_nomina.tipo_gasto = cuentas_contabilidad.cod_cta WHERE cod_edificio = :coe AND status = :st GROUP BY tipo_gasto ORDER BY tipo_gasto";
		$arrParam=[':coe'=>$codEd,':st'=>0];
		$arrEmp = ['control','aTip_gas','bNombCta','cMonto'];
		$nomMes = retrieve($general,$consulta,$arrParam,$arrEmp);
		
//COMISIONES BANCARIAS
		$consulta = "SELECT control,
							tipo_gasto as aTip_gas,
							cuentas_contabilidad.nombre_cta AS bNombCta,
							SUM(monto) AS cMonto, 
							entidades_bancarias.nombre_banco AS dbanco FROM comisiones_bancarias INNER JOIN entidades_bancarias ON comisiones_bancarias.banco = entidades_bancarias.cod_banco INNER JOIN cuentas_contabilidad ON comisiones_bancarias.tipo_gasto = cuentas_contabilidad.cod_cta WHERE cod_edificio = :coe AND status = :st GROUP BY comisiones_bancarias.tipo_gasto ORDER BY comisiones_bancarias.tipo_gasto";
		$arrParam=[':coe'=>$codEd,':st'=>0];
		$arrEmp = ['control','aTip_gas','bNombCta','cMonto','dbanco'];
		$comBan = retrieve($general,$consulta,$arrParam,$arrEmp);
		
//CONSULTA DE PROVISIONES
		$consulta = "SELECT control,
							tipo_gasto AS aTip_gas,
							cuentas_contabilidad.nombre_cta AS bNombCta,
							SUM(monto - usado) AS cMonto FROM provisiones INNER JOIN cuentas_contabilidad ON provisiones.tipo_gasto = cuentas_contabilidad.cod_cta WHERE cod_edificio = :coe AND status = :st GROUP BY tipo_gasto ORDER BY tipo_gasto";
		$arrParam=[':coe'=>$codEd,':st'=>0];
		$arrEmp = ['control','aTip_gas','bNombCta','cMonto'];
		$provMes = retrieve($general,$consulta,$arrParam,$arrEmp);

//DINERO EN BANCOS
		$consulta = "SELECT recibo_numero,fecha,SUM(monto) as monto FROM dinero_en_bancos WHERE cod_edificio =:coe ";
		$arrParam = [':coe'=>$codEd];
		$arrEmp = ['recibo_numero','fecha','monto'];
		$banco = retrieve($general,$consulta,$arrParam,$arrEmp);
//DINERO EN EFECTIVO
		$consulta = "SELECT recibo_numero,fecha,SUM(monto) as monto FROM dinero_en_efectivo WHERE cod_edificio =:coe ";
		$arrParam = [':coe'=>$codEd];
		$arrEmp = ['recibo_numero','fecha','monto'];
		$efectivo = retrieve($general,$consulta,$arrParam,$arrEmp);
//FONDO DE RESERVA
		$consulta = "SELECT recibo_numero,fecha,SUM(monto) as monto FROM fondo_de_reserva WHERE cod_edificio =:coe ";
		$arrParam = [':coe'=>$codEd];
		$arrEmp = ['recibo_numero','fecha','monto'];
		$reserva = retrieve($general,$consulta,$arrParam,$arrEmp);
//DINERO DE PROVISIONES
		$consulta = "SELECT recibo_numero,fecha,SUM(monto) AS monto FROM dinero_en_provisiones WHERE cod_edificio = :coe ";
		$arrParam = [':coe'=>$codEd];
		$arrEmp = ['recibo_numero','fecha','monto'];
		$provision = retrieve($general,$consulta,$arrParam,$arrEmp);
//CONSULTA PROPIETARIOS MOROSOS
		$consulta = "SELECT id,control,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha,monto,unidad,DATE_FORMAT(vencimiento,'%d/%m/%Y') AS vencimiento FROM(
		SELECT id,control,unidad,fecha,monto,vencimiento FROM ctas_por_cobrar WHERE cod_edificio = :coe AND status = 0
		UNION ALL 
		SELECT id,control,unidad,fecha,(monto - recib) AS monto,vencimiento FROM ctas_por_cobrar WHERE cod_edificio = :coe AND status = 1
		)ctas_unidas";

		$arrParam = [':coe'=>$codEd];
		$arrEmp = ['id','unid','codigo','monto'];
		$cta_cobrar = retrieve($general,$consulta,$arrParam,$arrEmp);

//MULTAS E INTERESES
		$consulta = 'SELECT DISTINCT num FROM multas_intereses WHERE cod_edificio = :coe ORDER BY id DESC LIMIT 1';
		$arrParam = [':coe'=>$codEd];
		if($general->selectDataThree($consulta,$arrParam)){
			$reg = $general->getRegistros();
			$consulta = "SELECT id,fecha,multa,interes FROM multas_intereses WHERE cod_edificio = :coe AND num = :nu";
			$arrParam=[':coe'=>$codEd,':nu'=>intval($reg['num'])];
			$arrEmp = ['id','fecha','multa','interes'];
			$intYmult = retrieve($general,$consulta,$arrParam,$arrEmp);
		}else{
			$intJRSet = createObject(['id','unidad','cargo','representante','duracion','inicio']);
			$intYmult = array($intJRSet);
		}
		
//RECIBOS DE COBRO
		$consulta = "SELECT control,fecha,vencimiento,desde,hasta,monto,pie FROM recibos_cobro WHERE cod_edificio = :coe ORDER BY id DESC LIMIT 3";
		$arrParam = [':coe'=>$codEd];
		$arrEmp = ['control','fecha','vencimiento','monto'];
		$rec_cobro = retrieve($general,$consulta,$arrParam,$arrEmp);
//PAGOS A CONFIRMAR
		$consulta = "SELECT control,unidad,DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha ,TRUNCATE(monto,2) AS monto,referencia,tipo_pago FROM pagos_propietarios WHERE cod_edificio = :coe AND status = :st";
		$arrParam = [':coe'=>$codEd,':st'=>0]; 
		$arrEmp = ['control','unidad','fecha','monto','referencia'];
		$pagos_no_ver = retrieve($general,$consulta,$arrParam,$arrEmp);
		
		echo json_encode(array("edificio"=>$edifResSet,
			"unidades"=>$unidResSet,
			"administrador"=>$admResSet,
			"junta"=>$juntResSet,
			"facturas_resumen"=>$facPagad,
			"recibos_resumen"=>$recPagad,
			"cuentas_pagar"=>$facPend,
			"empleados_edificio"=>$empEdif,
			"nomina_mes"=>$nomMes,
			"comision_banco"=>$comBan,
			"provisiones"=>$provMes,
			"dineroBan"=>$banco,
			"dineroEfec"=>$efectivo,
			"fondoR"=>$reserva,
			"dineroProv"=>$provision,
			"cxc"=>$cta_cobrar,
			"int_multa"=>$intYmult,
			"rec_cobro"=>$rec_cobro,
			"pag_no_ver"=>$pagos_no_ver));
		http_response_code(200);
	}else{
		echo json_encode('Fallo En La Conexion');
		http_response_code(500);
	}
}else{
	
}
?>
