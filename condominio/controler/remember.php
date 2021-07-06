<?php
// required headers
header("Access-Control-Allow-Origin: http://kondominus/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

/*include_once '../config/core.php';
include_once '../config/database.php';
include_once '../objects/usuarioObject.php';
include_once "../libs/php/utils.php";*/

$database = new Database();
$db = $database->getConnection();
if($database->conn == null){
	http_response_code(500);
	echo json_encode(array("codigo"=>'RE001',
						   "message" =>'Sin Conexión Con La Base De Datos',
	                       "messageTwo"=>"Sin Conexión",
						   "Codigo Acceso"=>"No Generado"));
}else{
	//verificar si el correo existe y esta verificado
	$data = json_decode(file_get_contents("php://input"));
	$email = $data->em;
	$usuario = new UsuarioObject($db);
	$utils = new Utils();
	$usuario->setCorreo($email);
	if(!$usuario->existeCorreo()){
		http_response_code(400);
	    echo json_encode(array("codigo"=>'RE002',
							   "message" =>'El Correo Introducido No Existe.',
	                           "messageTwo"=>"Por Favor Diríjase A Registro.",
						       "Codigo Acceso"=>"No Generado"));
	}else{
		//el correo existe. Revisar si esta verificado
		$usuario->revisaEstatus();
		$access_code = $usuario->getCodigoAcceso();
		/*if($usuario->getEstatus() == 1){
			//el correo existe y esta verificado
			http_response_code(200);
			echo json_encode(array("message" => "Por Favor Intorduzca Su Nueva Contraseña",
	                               "messageTwo"=>$email,
						           "Codigo Acceso"=>$access_code));

		}else{*/
			//el correo existe, pero no esta verificado.hay que hacerlo
			$send_to_email=$email;
			$body="Sr Usuario: .<br /><br />";
			$body.="Su codigo De Acceso es:
				        <br><strong style='font-size: 24px;color:red;'>{$access_code}</strong>
						<br><br>Copie El Codigo De Acceso Generado Y Peguelo En El Campo Requerido (Codigo De Acceso) De La Pagina Que Redirecciona El Vinculo A Continuacion:
					    <br><br><a href='".$home_url."codigoacceso'>Continuar En kondominus</a>";
			$subject="Recuperación De Contraseña";
			if($utils->sendEmailViaPhpMail($send_to_email, $subject, $body)){
			   http_response_code(200);
			   echo json_encode(array("codigo" =>'RE003',
									  "message" => "Su codigo De Acceso Para La Recuperación De Su Contraseña Fue Enviado A Su Correo Electrónico.",
	                                  "messageTwo"=>"Por Favor Introduzca Dicho Código Para Asignar Su Contraseña.",
						              "Codigo Acceso"=>$access_code));

			}else{
			   http_response_code(400);
			   echo json_encode(array("codigo"=>'RE004',
									  "message" => "No Pudo Enviarse El Correo De Validacion. Por Favor Contacte Al Administrador.",
	                                  "messageTwo"=>$utils->getInfoError(),
						              "Codigo Acceso"=>$access_code));
			}
		//}
		
	}
}

?>