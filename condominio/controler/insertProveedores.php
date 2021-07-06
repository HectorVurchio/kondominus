<?php

if($adminPermission && $compParam){
	$database = new Database();
	$db = $database->getConnection();
	if($db != null){
		$proveedor = new GeneralObject($db);
		$consulta = "SELECT nombre,direccion,estado,ciudad,telefono,actividad,contacto,correo FROM proveedores ".
					"INNER JOIN estados ON proveedores.id_estado = estados.id_estado ".
					"INNER JOIN ciudades ON proveedores.id_ciudad = ciudades.id_ciudad ".
					"WHERE cod_edificio = :coe AND rif = :ri LIMIT 0,1";
		$arrParam=[':coe'=>$codEd,':ri'=>$rif];
		if($proveedor->selectDataOne($consulta,$arrParam)){
			if($proveedor->getNumRegistros()>0){
				http_response_code(403); //Authorization Failed
				echo json_encode(array("message" =>"Authorization Failed Uno",
									"response"=>"NO Posee Permisos Uno"));
			}else{
				$consulta = "INSERT INTO proveedores SET cod_edificio = :coe,".
				"rif = :ri, nombre = :name,direccion = :address, id_estado = :st, id_ciudad = :city,".
				"telefono = :phone, actividad = :act, contacto = :cont, correo = :email";
				$arrParam=[':coe'=>$codEd,':ri'=>$rif,':name'=>$nombre,':address'=>$direccion,':st'=>$estado,
							':city'=>$ciudad,':phone'=>$telefono,':act'=>$actividad,':cont'=>$contacto,':email'=>$correo];
				if($proveedor->insertDataOne($consulta,$arrParam)){
					http_response_code(200); //Success
					echo json_encode(array("message" =>"Success",
									"response"=>"Registro Exitoso"));
				}else{
					http_response_code(400); //The requested resource could not be found.
					echo json_encode(array("message" =>"The requested resource could not be Executed",
									"response"=>$proveedor->getInfoError()));
				}
			}	
		}else{
			echo json_encode(array("message" =>"Fallo En La Consulta",
									"response"=>"NO Entra"));
			http_response_code(400);
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