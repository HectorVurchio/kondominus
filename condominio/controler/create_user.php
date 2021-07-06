<?php
header("Access-Control-Allow-Origin: http://localhost/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$database = new Database();
$db = $database->getConnection();
if($database->conn == null){
	http_response_code(500);
	echo json_encode(array("codigo"=>'CR001',
						   "message" =>'Sin Conexión Con La Base De Datos',
	                       "messageTwo"=>"Sin Conexión",
						   "Codigo Acceso"=>"No Generado"));
}else{
	$data = json_decode(file_get_contents("php://input"));
	$anteNombre = ucwords(strtolower($data->nombre));
	$nombre= preg_replace('/[^A-Za-z0-9\-]/', ' ', $anteNombre);
	$anteApellido = ucwords(strtolower($data->apellido));
	$apellido= preg_replace('/[^A-Za-z0-9\-]/', ' ',$anteApellido);
	$anteEmail = $data->email;
	$expAntEm = explode('@',$anteEmail);
	if(count($expAntEm) == 2){
		$expAntEmDos = explode('.',$expAntEm[1]);
		if(count($expAntEmDos) == 2){
			$email = preg_replace('/[^A-Za-z0-9\-\_]/', '',$expAntEm[0]).'@'.preg_replace('/[^A-Za-z0-9\-\_]/', '',$expAntEmDos[0]).'.'.preg_replace('/[^A-Za-z0-9\-]/', '',$expAntEmDos[1]);
		}else{
			$email = '';
		}
	}else{
		$email = '';
	}
	$cedula = preg_replace('/\D/', '',$data->rif);
	$usuario = new UsuarioObject($db);
	$cedIni = explode('-',$data->rif); //nuevo ($cedIni[0].'-'.$cedula)  nuevo 
	$utils = new Utils();
	$usuario->setCorreo($email);
	if($usuario->existeCorreo()){
		$usuario->revisaEstatus();
		$access_code = $usuario->getCodigoAcceso();
		if($usuario->getEstatus() == 1){
			http_response_code(400);
			//el correo existe y esta verificado
			echo json_encode(array("codigo"=>'CR002',
								   "message" => "El Correo " . $email . " Existe Y Fue Verificado",
								   "messageTwo"=>"Por Favor Diríjase A Olvidó Su Contraseña",
							       "Codigo Acceso"=>$access_code));
		}else{
			//el correo existe, pero no esta verificado.hay que hacerlo
		
			$send_to_email=$email;
			$body="Sr Usuario: .<br /><br />";
			$body.="Su codigo De Acceso es:
				        <br><strong style='font-size: 24px;color:red;'>{$access_code}</strong>
						<br><br>Copie El Codigo De Acceso Generado Y Peguelo En El Campo Requerido (Codigo De Acceso) De La Pagina Que Redirecciona El Vinculo A Continuacion:
					    <br><br><a href='".$home_url."codigoacceso'>Continuar En kondominus</a>";
			$subject="Validacion De Correo Electronico";
			if($utils->sendEmailViaPhpMail($send_to_email, $subject, $body)){
			   http_response_code(200);
			   echo json_encode(array("codigo"=>'CR003',
									  "message" => "Su codigo De Acceso Para La Asignacion De Su Contraseña Fue Enviado A Su Correo Electrónico.",
	                                  "messageTwo"=>"Por Favor Introduzca Dicho Código Para Asignar Su Contraseña.",
						              "Codigo Acceso"=>$access_code,
									  "error"=>$utils->getInfoError()));

			}else{
			   http_response_code(400);
			   echo json_encode(array("codigo"=>'CR004',
									  "message" => "No Pudo Enviarse El Correo De Validacion. Por Favor Contacte Al Administrador.",
	                                  "messageTwo"=>"El Correo ${email} Ya esta Registrado sin verificación ",
						              "Codigo Acceso"=>$access_code,
									  "error"=>$utils->getInfoError()));
			}
		}
	}else{
		if($nombre != '' || $apellido != '' || $email != '' || $cedula != ''){
			//se crea el usuario con estatus sin verificar y se manda un correo para su verificacion
			$usuario->setNombre($nombre);
			$usuario->setApellido($apellido);
			$usuario->setCorreo($email);
			$usuario->setCedula($cedIni[0].'-'.$cedula);
			$estatus = 0; //correo sin Verificar
			$usuario->setEstatus($estatus);
			if($usuario->crearUsuario()){
				$access_code = $usuario->getCodigoAcceso();
				$send_to_email=$email;
				$body="Sr Usuario: .<br /><br />";
				$body.="Su codigo De Acceso es:
				        <br><strong style='font-size: 24px;color:red;'>{$access_code}</strong>
						<br><br>Copie El Codigo De Acceso Generado Y Peguelo En El Campo Requerido (Codigo De Acceso) De La Pagina Que Redirecciona El Vinculo A Continuacion:
					    <br><br><a href='".$home_url."codigoacceso'>Continuar En kondominus</a>";
				$subject="Validacion De Correo Electronico";
				if($utils->sendEmailViaPhpMail($send_to_email, $subject, $body)){
					http_response_code(200);
					echo json_encode(array("codigo"=>'CR005',
										   "message" => "Su codigo De Acceso Para La Asignacion De Su Contraseña Fue Enviado A Su Correo Electrónico.",
										   "messageTwo"=>"Por Favor Introduzca Dicho Código Para Asignar Su Contraseña.",
										  "Codigo Acceso"=>$access_code,
									      "error"=>$utils->getInfoError()));

				}else{
					http_response_code(400);
					echo json_encode(array("codigo"=>'CR006',
										   "message" => "Se Creo El Usuario Pero No Pudo Enviarse El Correo De Validacion. Por Favor Contacte Al Administrador.",
										   "messageTwo"=>"",
										"Codigo Acceso"=>$access_code,
										"error"=>$utils->getInfoError()));
				}
			}else{
				http_response_code(500);
				echo json_encode(array("codigo"=>'CR007',
										"message" => "No Se Pudo Crear El Usuario. Por Favor Intente Mas Tarde",
										"messageTwo"=>"",
										"Codigo Acceso"=>"No Generado",
										"error"=>$usuario->getInfoError()));
			}
		}
	
	}
}
?>