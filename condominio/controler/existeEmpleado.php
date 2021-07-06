<?php
/*Objetos En Caso Se No Encontrarse Datos*/
function createObject($arrKey){
	$nomVar = new stdClass;
	foreach($arrKey as $key => $value){
		$nomVar->$value = 'none';
	}
	return $nomVar;
}
/* Hasta Aqui Los Objetos*/
if($adminPermission && $compParam){
	$database = new Database();
	$db = $database->getConnection();
	if($db != null){
			$proveedor = new GeneralObject($db);
			$consulta = "SELECT nombre,direccion,estado,ciudad,telefono,correo,actividad,sueldo FROM empleados ".
					"INNER JOIN estados ON empleados.id_estado = estados.id_estado ".
					"INNER JOIN ciudades ON empleados.id_ciudad = ciudades.id_ciudad ".
					"WHERE cod_edificio = :coe AND cedula = :ce LIMIT 0,1"; 
			$arrParam=[':coe'=>$codEd,':ce'=>$rif];
			if($proveedor->selectDataOne($consulta,$arrParam)){
				if($proveedor->getNumRegistros()>0){
					$provResSet = $proveedor->getRegistros();
					$numReg = 'Presente';
				}else{
					$empProvResSet = createObject(['nombre','direccion','estado','ciudad','telefono','correo','actividad','sueldo']);
					$provResSet = array($empProvResSet);
					$numReg = 'Ausente';
				}
				http_response_code(200);
				echo json_encode(array("proveedor"=>$provResSet,"numReg"=>$numReg));
			
			}else{
				$empProvResSet = createObject(['nombre','direccion','estado','ciudad','telefono','correo','actividad','sueldo']);
				$provResSet = array($empProvResSet);
				$numReg = 'Error';
				http_response_code(400);
				echo json_encode(array("proveedor"=>$provResSet,"numReg"=>$numReg));
			}
			
	}else{
		$empProvResSet = createObject(['nombre','direccion','estado','ciudad','telefono','correo','actividad','sueldo']);
		$provResSet = array($empProvResSet);
		$numReg = 'Error';
		http_response_code(500);
		echo json_encode(array("proveedor"=>$provResSet,"numReg"=>$numReg));
	}
}else{
	$empProvResSet = createObject(['nombre','direccion','estado','ciudad','telefono','correo','actividad','sueldo']);
	$provResSet = array($empProvResSet);
	$numReg = 'Error';
	http_response_code(403);
	echo json_encode(array("proveedor"=>$provResSet,"numReg"=>$numReg));
}

?>