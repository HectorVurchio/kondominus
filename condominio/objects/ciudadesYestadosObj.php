<?php
class CiudadesYEstados{
    private $conexion;
    private $tablaEstados = "estados";
	private $tablaTelefonos = "bd_pref_tel_ciudad";
	private $estado;
	private $id_estado;
	private $iso_31662;
	private $result;
	private $numRegistros;
	private $infoError;
	private $telefResult;

    public function __construct($bd){
        $this->conexion = $bd;
    }

	public function getResult(){
		return $this->result;
	}
	public function getTelefResult(){
		return $this->telefResult;
	}
	
	public function getInfoError(){
		return $this->infoError;
	}


	function estadosVenezolanos(){
		$consulta = "SELECT id_estado,estado FROM " . $this->tablaEstados; 
		$declaracionPDO = $this->conexion->prepare($consulta);
		if($declaracionPDO->execute()){ 	
			$numFilas = $declaracionPDO->rowCount();
			$this->numRegistros=$numFilas;
			$fila = $declaracionPDO->fetchAll(PDO::FETCH_ASSOC);
			$this->result=$fila;	
			return true; 
	  }	else{
			$this->showError($declaracionPDO);
			return false;
	  }   				
	}
	private function showError($declaracionPDO){
          $this->infoError =$declaracionPDO->errorInfo();
	}
	
	function telefonosVenezolanos(){
		$consulta = "SELECT id_pref_ciudad,ciudad,prefijo_telefonico,id_ciudad,id_estado FROM " . $this->tablaTelefonos; 
		$declaracionPDO = $this->conexion->prepare($consulta);
		if($declaracionPDO->execute()){ 	
			$numFilas = $declaracionPDO->rowCount();
			$this->numRegistros=$numFilas;
			$fila = $declaracionPDO->fetchAll(PDO::FETCH_ASSOC);
			$this->telefResult=$fila;	
			return true; 
	  }	else{
			$this->showError($declaracionPDO);
			return false;
	  }   				
	}
}

?>