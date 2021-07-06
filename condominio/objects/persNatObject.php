<?php
class PersNatObject{
	private $conexion;
    private $nombreTabla = "per_naturales";
	private $tablaJoinOne = "estados";
	private $tablaJoinTwo = "ciudades";
	private $cod_edificio;
    private $cedula;
	private $nombre;
	private $direccion;
    private $id_estado;
    private $id_ciudad;
    private $telefono;
    private $actividad;
	private $codigo_acceso;
	private $persona;
	private $infoError;
	
	public function __construct($bd){
        $this->conexion = $bd;
    }
	public function setCodigoEdificio($coed){
		$this->cod_edificio = $coed;
	}
	public function setCedula($ced){
		$this->cedula = $ced;
	}
	public function getPersona(){
		return $this->persona;
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
	
	public function setCodigoAcceso($coac){
		$this->codigo_acceso = $coac;
	}

	
	function existePersona(){
		$consulta = "SELECT nombre,direccion,estado,ciudad,telefono,actividad FROM ".$this->nombreTabla." ".
					"INNER JOIN ".$this->tablaJoinOne." ON ".$this->nombreTabla.".id_estado = ".$this->tablaJoinOne.".id_estado ".
					"INNER JOIN ".$this->tablaJoinTwo." ON ".$this->nombreTabla.".id_ciudad = ".$this->tablaJoinTwo.".id_ciudad  ".
					"WHERE cod_edificio = :ce AND cedula = :cedu LIMIT 0,1";
        $declaracionPDO = $this->conexion->prepare($consulta);
	    $this->cod_edificio=htmlspecialchars(strip_tags($this->cod_edificio));
        $this->cedula=htmlspecialchars(strip_tags($this->cedula));
		$declaracionPDO->bindParam(':ce', $this->cod_edificio);
        $declaracionPDO->bindParam(':cedu', $this->cedula);		
        $declaracionPDO->execute(); 	
		$numFilas = $declaracionPDO->rowCount();
		if($numFilas>0){
			$fila = $declaracionPDO->fetch(PDO::FETCH_ASSOC);
			$this->persona = $fila;
			return true; 
		}	else{
			return false;
		}   
	}
	
	public function showError($declaracionPDO){
        $this->infoError = $declaracionPDO->errorInfo();
    }
	
	public function registraPersona(){
		$consulta = "INSERT INTO " . $this->nombreTabla . " SET cod_edificio = :ce, cedula = :cedu,
		             nombre = :name, direccion = :address, id_estado = :st, id_ciudad = :city,
					 telefono = :phone, actividad = :act, cod_acceso = :coa";
		$declaracionPDO = $this->conexion->prepare($consulta);

		$this->cod_edificio=htmlspecialchars(strip_tags($this->cod_edificio));
		$this->cedula=htmlspecialchars(strip_tags($this->cedula));
		$this->nombre=htmlspecialchars(strip_tags($this->nombre));
		$this->direccion=htmlspecialchars(strip_tags($this->direccion));
		$this->id_estado=htmlspecialchars(strip_tags($this->id_estado));
		$this->id_ciudad=htmlspecialchars(strip_tags($this->id_ciudad));
		$this->telefono=htmlspecialchars(strip_tags($this->telefono));
		$this->actividad=htmlspecialchars(strip_tags($this->actividad));
		$this->codigo_acceso=htmlspecialchars(strip_tags($this->codigo_acceso));

		$declaracionPDO->bindParam(':ce', $this->cod_edificio);
		$declaracionPDO->bindParam(':cedu', $this->cedula);
		$declaracionPDO->bindParam(':name', $this->nombre);
		$declaracionPDO->bindParam(':address', $this->direccion);
		$declaracionPDO->bindParam(':st', $this->id_estado);
		$declaracionPDO->bindParam(':city', $this->id_ciudad);
		$declaracionPDO->bindParam(':phone', $this->telefono);
		$declaracionPDO->bindParam(':act', $this->actividad);
		$declaracionPDO->bindParam(':coa', $this->codigo_acceso);


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