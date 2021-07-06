<?php  
class Request {
public $method;
public $uri;
public $protocolo;
  function __construct(){
    $this->paramServer();
  }

  private function paramServer(){

		$this->method = $_SERVER['REQUEST_METHOD'];
		$this->uri = $_SERVER['REQUEST_URI'];
		$this->protocolo = $_SERVER['SERVER_PROTOCOL'];
  }

public function agregarAdministrador(){
if($this->method === "POST"){
		include_once 'condominio/config/core.php';
		include_once 'condominio/config/database.php';
		include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
		include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
		include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
		include_once 'condominio/libs/php-jwt-master/src/JWT.php';
		include_once 'condominio/inputParam/consultaEdificioInput.php';
		include_once 'condominio/controler/verifAdminTres.php';
		include_once 'condominio/objects/generalObject.php';
		include_once 'condominio/controler/agregarAdministrador.php';
	}	
}

public function agregarJuntaDeCondominio(){
if($this->method === "POST"){
		include_once 'condominio/config/core.php';
		include_once 'condominio/config/database.php';
		include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
		include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
		include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
		include_once 'condominio/libs/php-jwt-master/src/JWT.php';
		include_once 'condominio/inputParam/registraJuntaInput.php';
		include_once 'condominio/controler/verifAdminTres.php';
		include_once 'condominio/objects/generalObject.php';
		include_once 'condominio/controler/agregarJuntaCond.php';
	}	
}

public function buscaIndexedDB(){
	include_once 'condominio/config/core.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/generalObject.php';
	include_once 'condominio/controler/ciudadesYestadosControler.php';
}

public function consultarEgresos(){
	if($this->method === "POST"){
		include_once 'condominio/config/core.php';
		include_once 'condominio/config/database.php';
		include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
		include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
		include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
		include_once 'condominio/libs/php-jwt-master/src/JWT.php';
		include_once 'condominio/inputParam/consultaEdificioInput.php';
		include_once 'condominio/controler/verifAdminDos.php';
		include_once 'condominio/objects/generalObject.php';
		include_once 'condominio/controler/consultarEgresos.php';

	}		
}

public function consultarCobro(){
	if($this->method === "POST"){
		include_once 'condominio/config/core.php';
		include_once 'condominio/config/database.php';
		include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
		include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
		include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
		include_once 'condominio/libs/php-jwt-master/src/JWT.php';
		include_once 'condominio/inputParam/consultaCobroInput.php';
		include_once 'condominio/controler/verifAdminDos.php';
		include_once 'condominio/objects/generalObject.php';
		include_once 'condominio/controler/consultarRecibos.php';

	}		
}

public function eliminarAdministrador(){
	if($this->method === "DELETE"){
		include_once 'condominio/config/core.php';
		include_once 'condominio/config/database.php';
		include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
		include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
		include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
		include_once 'condominio/libs/php-jwt-master/src/JWT.php'; 	
		include_once 'condominio/inputParam/elimAdminInput.php';
		include_once 'condominio/controler/verifAdminTres.php';
		include_once 'condominio/objects/generalObject.php';
		include_once 'condominio/controler/eliminarAdministrador.php';
	}
}

public function generaString($strenght){
		$input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
		   $input_lenght=strlen($input);
		   $random_string="";
		   for($i=0;$i<$strenght;$i++){
			   $random_character=$input[mt_rand(0,$input_lenght-1)];
			   $random_string.=$random_character;
		   }
	 return $random_string;
}

public function getInfoEdificio(){
if($this->method === "POST"){
		include_once 'condominio/config/core.php';
		include_once 'condominio/config/database.php';
		include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
		include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
		include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
		include_once 'condominio/libs/php-jwt-master/src/JWT.php';
		include_once 'condominio/inputParam/consultaEdificioInput.php';
		include_once 'condominio/controler/verifAdminDos.php';
		include_once 'condominio/objects/generalObject.php';
		include_once 'condominio/controler/getInfoEdificio.php';

	}	
}

public function registrarCobros(){
	if($this->method == "POST"){
		include_once 'condominio/config/core.php';
		include_once 'condominio/config/database.php';
		include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
		include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
		include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
		include_once 'condominio/libs/php-jwt-master/src/JWT.php';
		include_once 'condominio/inputParam/registroReciboInput.php';
		include_once 'condominio/controler/verifAdminDos.php';
		include_once 'condominio/objects/generalObject.php';
		include_once 'condominio/controler/regRecibosCobro.php';		
	}
}

public function registraMultaEinteres(){
	if($this->method === "POST"){
		include_once 'condominio/config/core.php';
		include_once 'condominio/config/database.php';
		include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
		include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
		include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
		include_once 'condominio/libs/php-jwt-master/src/JWT.php';
		include_once 'condominio/inputParam/consultaEdificioInput.php';
		include_once 'condominio/controler/verifAdminDos.php';
		include_once 'condominio/objects/generalObject.php';
		include_once 'condominio/controler/regmultaint.php';
	}
}


public function registrarEdificio(){
	if($this->method === "POST"){
		include_once 'condominio/config/core.php';
		include_once 'condominio/config/database.php';
		include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
		include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
		include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
		include_once 'condominio/libs/php-jwt-master/src/JWT.php';
		include_once 'condominio/inputParam/registroEdificioInput.php';
		include_once 'condominio/objects/UserInfo.php';
		include_once 'condominio/objects/generalObject.php';
		include_once 'condominio/controler/verifUserUno.php';
		include_once 'condominio/controler/registrarEdificio.php';	
	}
}

public function registrarEgresos(){
	if($this->method === "POST"){
	  include_once 'condominio/config/core.php';
	  include_once 'condominio/config/database.php';
	  include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
      include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
      include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
      include_once 'condominio/libs/php-jwt-master/src/JWT.php';
	  include_once 'condominio/inputParam/consultaEdificioInput.php';
	  include_once 'condominio/controler/verifAdminDos.php';
	  include_once 'condominio/objects/generalObject.php';
	  include_once 'condominio/controler/insertarEgresos.php';
	}	
}


public function registrarEmpleados(){
	if($this->method === "POST"){
	  include_once 'condominio/config/core.php';
	  include_once 'condominio/config/database.php';
	  include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
      include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
      include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
      include_once 'condominio/libs/php-jwt-master/src/JWT.php';
	  include_once 'condominio/inputParam/consultaEdificioInput.php';
	  include_once 'condominio/controler/verifAdminDos.php';
	  include_once 'condominio/objects/generalObject.php';
	  include_once 'condominio/controler/insertEmpleados.php';
	} 
}

public function registrarIngresos(){
	if($this->method === "POST"){
	  include_once 'condominio/config/core.php';
	  include_once 'condominio/config/database.php';
	  include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
      include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
      include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
      include_once 'condominio/libs/php-jwt-master/src/JWT.php';
	  include_once 'condominio/inputParam/registraIngresoInput.php';
	  include_once 'condominio/controler/verifAdminDos.php';
	  include_once 'condominio/objects/generalObject.php';
	  include_once 'condominio/controler/insertarPagosProp.php';
	}
}

public function registrarProveedores(){
	if($this->method === "POST"){
	  include_once 'condominio/config/core.php';
	  include_once 'condominio/config/database.php';
	  include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
      include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
      include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
      include_once 'condominio/libs/php-jwt-master/src/JWT.php';
	  include_once 'condominio/inputParam/consultaEdificioInput.php';
	  include_once 'condominio/controler/verifAdminDos.php';
	  include_once 'condominio/objects/generalObject.php';
	  include_once 'condominio/controler/insertProveedores.php';
	} 
}

public function rememberPass(){
	if ($this->method == "POST"){
		include_once 'condominio/config/core.php';
		include_once 'condominio/config/database.php';
		include_once 'condominio/objects/usuarioObject.php';
		include_once "condominio/libs/php/utils.php";
		include_once 'condominio/controler/remember.php';
	}
}

public function setAccessCode(){
	if ($this->method == "PUT"){
	  include_once 'condominio/config/core.php';
      include_once 'condominio/config/database.php';
      include_once 'condominio/objects/usuarioObject.php';
      include_once 'condominio/controler/assignPassword.php';
    }
}

public function setLogin(){
	if ($this->method == "POST"){
	  include_once 'condominio/config/core.php';
      include_once 'condominio/config/database.php';
      include_once 'condominio/objects/usuarioObject.php';
	  include_once 'condominio/objects/propietariosObject.php';
	  include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
      include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
      include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
      include_once 'condominio/libs/php-jwt-master/src/JWT.php';
	  include_once 'condominio/objects/UserInfo.php';
	  include_once 'condominio/objects/controlAccesosObject.php';	  
      include_once 'condominio/controler/login.php';
    }
}

public function setNewUser(){
	if ($this->method == "POST"){
	  include_once 'condominio/config/core.php';
      include_once 'condominio/config/database.php';
      include_once 'condominio/objects/usuarioObject.php';
      include_once "condominio/libs/php/utils.php";
      include_once 'condominio/controler/create_user.php';
    }	
}

public function vencerAccesoDiario(){
	include_once 'condominio/config/core.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/controler/expirarAcceso.php';
}

public function verificarCedula(){
	if($this->method === "POST"){
	  include_once 'condominio/config/core.php';
	  include_once 'condominio/config/database.php';
	  include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
      include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
      include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
      include_once 'condominio/libs/php-jwt-master/src/JWT.php';
	  include_once 'condominio/inputParam/consultaEdificioInput.php';
	  include_once 'condominio/controler/verifAdminDos.php';
	  include_once 'condominio/objects/generalObject.php';
	  include_once 'condominio/controler/existeEmpleado.php';
	} 
}

public function verificarEdificio(){
	if($this->method === "POST"){
	  include_once 'condominio/config/core.php';
	  include_once 'condominio/config/database.php';
	  include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
      include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
      include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
      include_once 'condominio/libs/php-jwt-master/src/JWT.php';
	  include_once 'condominio/inputParam/verificaEdificioInput.php';
	  include_once 'condominio/objects/generalObject.php';
	  include_once 'condominio/controler/existeEdificio.php';
	}	  
}

public function verificarRif(){
	  include_once 'condominio/config/core.php';
	  include_once 'condominio/config/database.php';
	  include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
      include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
      include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
      include_once 'condominio/libs/php-jwt-master/src/JWT.php';
	  include_once 'condominio/inputParam/consultaEdificioInput.php';
	  include_once 'condominio/controler/verifAdminDos.php';
	  include_once 'condominio/objects/generalObject.php';
	 include_once 'condominio/controler/existeProveedor.php';
}

public function verificarToken(){
	if ($this->method == "POST"){
	  include_once 'condominio/config/core.php';
	  include_once 'condominio/libs/php-jwt-master/src/BeforeValidException.php';
      include_once 'condominio/libs/php-jwt-master/src/ExpiredException.php';
      include_once 'condominio/libs/php-jwt-master/src/SignatureInvalidException.php';
      include_once 'condominio/libs/php-jwt-master/src/JWT.php';
	  include_once 'condominio/controler/validate_token.php';
	}
}

}
?>