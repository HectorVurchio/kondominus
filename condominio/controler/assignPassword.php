<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// get database connection
$database = new Database();
$db = $database->getConnection();
if($database->conn == null){
	http_response_code(500);
	echo json_encode(array("message" =>'Sin Conexión Con La Base De Datos',
	                       "messageTwo"=>"Sin Conexión"));
}else{
	$data = json_decode(file_get_contents("php://input"));
	$access_code= $data->codAcc;
	$password = $data->passw;
	$usuario = new UsuarioObject($db);
	$usuario->setCodigoAcceso($access_code);
	$estatus = 1;
	$usuario->setEstatus($estatus);
	$usuario->setClave($password);
	if($usuario->correoVerifica()){
		http_response_code(200);
		echo json_encode(array("message" => "Su Clave Fue Asignada Satisfactoriamente",
	                      "messageTwo"=>"Ya Puede Ingresar"));
	}else{
		http_response_code(400);
		echo json_encode(array("message" => "Su Clave No Pudo Ser Asignada",
	                      "messageTwo"=>$usuario->getInfoError()));
	}	
}

?>