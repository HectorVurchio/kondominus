<?php
header("Access-Control-Allow-Origin: http://localhost/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$data = json_decode(file_get_contents("php://input"));
$property = $data->property;
$numbers = [];
$database = new Database();
$db = $database->getConnection();
if($db != null){
	$controlAcceso = new ControlAccesosObject($db);
	for($i=0;$i<count($property);$i++){
		$propSplited = explode('&',$property[$i]);
		$controlAcceso->setNumeroAcceso($propSplited[5]);	
		if($controlAcceso->cambiarEstatusCero()){
			$flag = true;
		}else{
			$flag = false;
		}
	}
	if($flag == true){
		http_response_code(200);
	}else{
		http_response_code(400);
	}

}else{
	http_response_code(500);
}


?>