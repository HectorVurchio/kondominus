<?php
class UsuarioObject{
    private $conexion;
    private $nombreTabla = "usuarios";

    private $id;
    private $nombre;
    private $apellido;
    private $correo;
    private $numeroContacto;
    private $clave;
    private $nivelAcceso;
	private $codigoAcceso;
    private $cedula;
    private $estatus;
    private $creada;
    private $modificada;
	private $infoError;
	private $claveProvisional;
	
	public function __construct($bd){
      $this->conexion = $bd;
    }
	public function getId(){
	   return $this->id;
	}
	public function setCorreo($email){
	  $this->correo=$email;
	}
	public function getCorreo(){
	  return $this->correo;
	}
	public function getNombre(){
	   return $this->nombre;
	}
    public function setNombre($nombre){
	   $this->nombre = $nombre;
	}		
	public function getApellido(){
	   return $this->apellido;
	}
	public function setApellido($apellido){
	   $this->apellido = $apellido;
	}
	public function getNivelAcceso(){
	   return $this->nivelAcceso;
	}
	public function setNivelAcceso($nivelAcceso){
	   $this->nivelAcceso = $nivelAcceso;
	}

	public function getClave(){
	   return $this->clave;
	}
	public function setClave($clave){
	 $this->clave=$clave;
	}
	public function getCedula(){
		return $this->cedula;
	}
	public function setCedula($cedula){
		$this->cedula = $cedula;
	}
	public function getEstatus(){
	   return $this->estatus;
	}
	
	public function setEstatus($estatus){
	   $this->estatus = $estatus;
	}
	
	public function getCodigoAcceso(){
	   return $this->codigoAcceso;
	}
	
	public function setCodigoAcceso($codigoAcceso){
	   $this->codigoAcceso = $codigoAcceso;
	}
	
	public function getInfoError(){
		return $this->infoError;
	}
	
	
    public function existeCorreo(){
    $consulta = "SELECT id, Nombre, Apellido,Clave,Cedula,Estatus FROM " . $this->nombreTabla . " WHERE Correo = ? LIMIT 0,1";
    $declaracionPDO = $this->conexion->prepare($consulta);
    $this->correo=htmlspecialchars(strip_tags($this->correo));
    $declaracionPDO->bindParam(1, $this->correo);
    $declaracionPDO->execute(); 
    $numFilas = $declaracionPDO->rowCount();
    if($numFilas>0){

        $fila = $declaracionPDO->fetch(PDO::FETCH_ASSOC);
 
        $this->id = $fila['id'];
        $this->nombre = $fila['Nombre'];
        $this->apellido = $fila['Apellido'];
        $this->clave = $fila['Clave'];
		$this->cedula = $fila['Cedula'];
        $this->estatus = $fila['Estatus'];

        return true;
    }else{
		return false;
	}

    
}

	function crearUsuario(){
		$this->creada=date('Y-m-d H:i:s');
		$consulta = "INSERT INTO " . $this->nombreTabla . " SET Nombre = :firstname, Apellido = :lastname,Correo = :email, Clave = :password, CodigoAcceso = :access_code, Cedula = :cedulaIdent, Estatus = :status, Creada = :created";

		$declaracionPDO = $this->conexion->prepare($consulta);

		$this->nombre=htmlspecialchars(strip_tags($this->nombre));
		$this->apellido=htmlspecialchars(strip_tags($this->apellido));
		$this->correo=htmlspecialchars(strip_tags($this->correo));
		$clave = $this->generaString(10);
		$codigoAcceso = $this->generaString(6);
		$this->cedula=htmlspecialchars(strip_tags($this->cedula));
		$this->estatus=htmlspecialchars(strip_tags($this->estatus));

		$declaracionPDO->bindParam(':firstname', $this->nombre);
		$declaracionPDO->bindParam(':lastname', $this->apellido);
		$declaracionPDO->bindParam(':email', $this->correo);
		$declaracionPDO->bindParam(':cedulaIdent', $this->cedula);

		$password_hash = password_hash($clave, PASSWORD_BCRYPT);
		$declaracionPDO->bindParam(':password', $password_hash);
		$declaracionPDO->bindParam(':access_code', $codigoAcceso);
		$declaracionPDO->bindParam(':status', $this->estatus);
		$declaracionPDO->bindParam(':created', $this->creada);
 
		if($declaracionPDO->execute()){
			$this->clave=$clave;
			$this->codigoAcceso = $codigoAcceso;
        return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}
 
	}

   public function showError($declaracionPDO){
          $this->infoError =$declaracionPDO->errorInfo();
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
	
	public function revisaEstatus(){
		$consulta = "SELECT Estatus,CodigoAcceso FROM " . $this->nombreTabla . " WHERE Correo = ? LIMIT 0,1";
		$declaracionPDO = $this->conexion->prepare($consulta);
		$this->correo=htmlspecialchars(strip_tags($this->correo));
		$declaracionPDO->bindParam(1, $this->correo);
		$declaracionPDO->execute(); 
		$numFilas = $declaracionPDO->rowCount();
		if($numFilas>0){
			$fila = $declaracionPDO->fetch(PDO::FETCH_ASSOC);
			$this->estatus = $fila['Estatus'];
			$this->codigoAcceso = $fila['CodigoAcceso'];
        return true;
		}
    return false;
	}  

	public function correoVerifica(){
		$consulta = "UPDATE " . $this->nombreTabla . " SET Estatus= :est, Clave= :cla WHERE CodigoAcceso = :coa";
		$declaracionPDO = $this->conexion->prepare($consulta);
		$this->estatus=htmlspecialchars(strip_tags($this->estatus));
		$this->codigoAcceso=htmlspecialchars(strip_tags($this->codigoAcceso));
		$this->clave=htmlspecialchars(strip_tags($this->clave));
		
		$declaracionPDO->bindParam(':est', $this->estatus);
		$declaracionPDO->bindParam(':coa', $this->codigoAcceso);
		$password_hash = password_hash($this->clave, PASSWORD_BCRYPT);
		$declaracionPDO->bindParam(':cla', $password_hash);
		if($declaracionPDO->execute()){
        return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}	
	}
}
?>