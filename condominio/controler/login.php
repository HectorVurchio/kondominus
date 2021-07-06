<?php
// required headers
header("Access-Control-Allow-Origin: https://www.kondominus.com/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$database = new Database();
$db = $database->getConnection();
$usuario = new UsuarioObject($db);
$propietario = new PropietariosObject($db); 

$data = json_decode(file_get_contents("php://input"));
$em = $data->em;
$pass = $data->pass;

$usuario->setCorreo($em);
$email_exists = $usuario->existeCorreo($em);

use \Firebase\JWT\JWT;
 
// check if email exists and if password is correct
if($email_exists && password_verify($data->pass, $usuario->getClave())){
	$cedula = $usuario->getCedula();
    $propietario->setCtaPropietario($cedula);
	if($propietario->consultaPropiedad()){
		$propiet = $propietario->getRegistros();
		$numReg = $propietario->getNumRegistros();
		$propError = "";
		$user = new UserInfo();
		$controlAcceso = new ControlAccesosObject($db);	
		$controlAcceso->setSistOper($user->get_os());
		$controlAcceso->setIP($user->get_ip());
		$controlAcceso->setNavegador($user->get_browser());
		$controlAcceso->setDispositivo($user->get_device());
		$controlAcceso->setCedula($cedula);
		$fechaHora = date("Y-m-d H:i:s");
		$controlAcceso->setFechaHora($fechaHora);
		$controlAcceso->setEstatus(1);
		$i=0;
		$numero_acceso[0] = '';
		$flag = true;
		
		if($numReg > 0){
			forEach($propiet as $p){
				$numero_acceso[$i] = $usuario->generaString(20);
				$controlAcceso->setNumeroAcceso($numero_acceso[$i]);
				$cod_propietario = $p['cod_propietario'];
				$controlAcceso->setCodPropietario($cod_propietario);
				if($controlAcceso->setControlDeAcceso()){
					$i++;
				}else{
					$flag=false;
					break;
				}
			}
		}else{
			$numero_acceso[0] = $usuario->generaString(20);
			$controlAcceso->setNumeroAcceso($numero_acceso[$i]);
			$cod_propietario = "J-000000000-00";
			$controlAcceso->setCodPropietario($cod_propietario);
			if($controlAcceso->setControlDeAcceso()){
				$flag=true;
			}else{
				$flag=false;
			}
		}

		if($flag){
			if($numReg > 0){
				$prop = $propietario->getRegistros();
			}else{
				$prop = array("nombre_edificio" => "Inmueble No Registrado",
										 "cod_propietario" => "J-000000000-N0",
										 "cod_edificio" => "J-000000000",
										 "unidad" => "N0",
										 "alicuota" => "0");
			}
			$propError = "";
			http_response_code(200);
		}else{
			$prop = "";
			$propError = $controlAcceso->getInfoError();
			http_response_code(401);
		}
	
	}else{
		$prop = "";
		$propError = $propietario->getInfoError();
		http_response_code(401);
	}

    $token = array(
       "iss" => $iss,
       "aud" => $aud,
       "iat" => $iat,
       "nbf" => $nbf,
       "data" => array(
           "id" =>$usuario->getId(),
           "Nombre" =>$usuario->getNombre(),
           "Apellido" =>$usuario->getApellido(),
           "email" =>$usuario->getCorreo(),
		   "Cedula"=>$cedula,
		   "Estatus"=>$usuario->getEstatus(),
		   "propiedad"=>$prop,
		   "propError"=>$propError,
		   "numero_acceso"=>$numero_acceso
        )
    );
 
    
 
    // generate jwt
    $jwt = JWT::encode($token, $key);
    echo json_encode(
            array("codigo"=>'LO001GO',
                "message" => "satisfactorio",
                "jwt" => $jwt
            )
        );
}else{  // login failed
 
    // set response code
    http_response_code(401);
 
    // tell the user login failed
    echo json_encode(array("codigo"=>'LO002FA',
							"message" => "Usuario o clave inválida",
                           "jwt" => "No creado"));
}
?>