<?php
/*diseñada para trabajar en cambio de propietario de manera que no se haga desde otro edificio */
use \Firebase\JWT\JWT;
if($propDoc != "" || $jwt != ""){
	$propDocDos = explode(',',$propDoc);
	$nombEdificio = $propDocDos[0];
	$numEdificio = $propDocDos[2];
	$numPropietario = $propDocDos[1];
	$unidad = $propDocDos[3];
	$estatus = $propDocDos[4];
	$numero_aceso = $propDocDos[5];
	
	try {
        $decoded = JWT::decode($jwt, $key, array('HS256'));
		  $numerosDeAcceso = $decoded->data->numero_acceso;
		  $propiedad = $decoded->data->propiedad;					
			for($i=0;$i<count($numerosDeAcceso);$i++){
				if($numerosDeAcceso[$i] == $numero_aceso){ //problema aqui
					if($propiedad[$i]->unidad == "ADMIN" && $propiedad[$i]->cod_edificio == $numEdificio){
						$sP = explode('-',$codigoProp);
						$sameProp = $sP[0].'-'.$sP[1];
						if($sameProp == $propiedad[$i]->cod_edificio){
							$adminPermission = true;
							break;
						}else{
							$adminPermission = false;
						}
					}else{
						$adminPermission = false;
					}
				}else{
					$adminPermission = false;
				}
			}
    }
    catch (Exception $e){
    $adminPermission = false;
   }
}else{
    $adminPermission = false;
}

?>