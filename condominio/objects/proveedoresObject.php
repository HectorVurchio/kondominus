<?php
class ProveedoresObject{
	private $conexion;
    private $nombreTabla = "proveedores";
	private $tablaJoinOne = "estados";
	private $tablaJoinTwo = "ciudades";
	private $id_proveedor;
	private $cod_edificio;
    private $rif;
	private $nombre;
	private $direccion;
    private $id_estado;
    private $id_ciudad;
    private $telefono;
    private $actividad;
    private $contacto;
    private $correo;
	private $proveedor;
	private $infoError;
	
	public function __construct($bd){
        $this->conexion = $bd;
    }
	public function setCodigoEdificio($coed){
		$this->cod_edificio = $coed;
	}
	public function setRif($rif){
		$this->rif = $rif;
	}
	public function getProveedor(){
		return $this->proveedor;
	}
	 public function getInfoError(){
		return $this->infoError;
	 }
	public function setNombre($nom){
		$this->nombre = $nom;
	}
	public function setDireccion($direc){
		$this->direccion = $direc;
	}
    public function setIdEstado($idest){
		$this->id_estado = $idest;
	}
    public function setIdCiudad($idCiud){
		$this->id_ciudad = $idCiud;
	}
    public function setTelefono($tel){
		$this->telefono = $tel;
	}
    public function setActividad($act){
		$this->actividad = $act;
	}
    public function setContacto($cont){
		$this->contacto = $cont;
	}
    public function setCorreo($corr){
		$this->correo = $corr;
	}
	
	function existeProveedor(){
		$consulta = "SELECT nombre,direccion,estado,ciudad,telefono,actividad,contacto,correo FROM ".$this->nombreTabla." ".
					"INNER JOIN ".$this->tablaJoinOne." ON ".$this->nombreTabla.".id_estado = ".$this->tablaJoinOne.".id_estado ".
					"INNER JOIN ".$this->tablaJoinTwo." ON ".$this->nombreTabla.".id_ciudad = ".$this->tablaJoinTwo.".id_ciudad  ".
					"WHERE cod_edificio = :ce AND rif = :ri LIMIT 0,1";
        $declaracionPDO = $this->conexion->prepare($consulta);
	    $this->cod_edificio=htmlspecialchars(strip_tags($this->cod_edificio));
        $this->rif=htmlspecialchars(strip_tags($this->rif));
		$declaracionPDO->bindParam(':ce', $this->cod_edificio);
        $declaracionPDO->bindParam(':ri', $this->rif);		
        $declaracionPDO->execute(); 	
		$numFilas = $declaracionPDO->rowCount();
		if($numFilas>0){
			$fila = $declaracionPDO->fetch(PDO::FETCH_ASSOC);
			$this->proveedor = $fila;
			return true; 
		}	else{
			return false;
		}   
	}
	
	public function showError($declaracionPDO){
        $this->infoError = $declaracionPDO->errorInfo();
    }
	
	public function registraProveedor(){
		$consulta = "INSERT INTO " . $this->nombreTabla . " SET cod_edificio = :ce, rif = :rif, nombre = :name,direccion = :address, id_estado = :st, id_ciudad = :city, telefono = :phone, actividad = :act, contacto = :cont, correo = :email";
		$declaracionPDO = $this->conexion->prepare($consulta);

		$this->cod_edificio=htmlspecialchars(strip_tags($this->cod_edificio));
		$this->rif=htmlspecialchars(strip_tags($this->rif));
		$this->nombre=htmlspecialchars(strip_tags($this->nombre));
		$this->direccion=htmlspecialchars(strip_tags($this->direccion));
		$this->id_estado=htmlspecialchars(strip_tags($this->id_estado));
		$this->id_ciudad=htmlspecialchars(strip_tags($this->id_ciudad));
		$this->telefono=htmlspecialchars(strip_tags($this->telefono));
		$this->actividad=htmlspecialchars(strip_tags($this->actividad));
		$this->contacto=htmlspecialchars(strip_tags($this->contacto));
		$this->correo=htmlspecialchars(strip_tags($this->correo));

		$declaracionPDO->bindParam(':ce', $this->cod_edificio);
		$declaracionPDO->bindParam(':rif', $this->rif);
		$declaracionPDO->bindParam(':name', $this->nombre);
		$declaracionPDO->bindParam(':address', $this->direccion);
		$declaracionPDO->bindParam(':st', $this->id_estado);
		$declaracionPDO->bindParam(':city', $this->id_ciudad);
		$declaracionPDO->bindParam(':phone', $this->telefono);
		$declaracionPDO->bindParam(':act', $this->actividad);
		$declaracionPDO->bindParam(':cont', $this->contacto);
		$declaracionPDO->bindParam(':email', $this->correo);	

		// se ejecuta la consulta y se chequea si fue exitosa
		if($declaracionPDO->execute()){
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}		 
	}
}
?>