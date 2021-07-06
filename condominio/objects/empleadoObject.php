<?php
class EmpleadoObject{
	private $connection;
	private $tablaUno = "empleados";
	private $tablaDos = "recibos_egresos_nomina";
	private $tablaJoinOne = "estados";
	private $tablaJoinTwo = "ciudades";
	private $cod_edificio;
	private $registros;
	private $infoError;
	private $numRegistros;
	private $codigo_recibo;
	
	public function __construct($bd){
		$this->conexion = $bd;
	}
	
	public function setCod_edificio($codEd){
		$this->cod_edificio=$codEd;
	}
	public function getRegistros(){
		return $this->registros;
	}
	public function getNumRegistros(){
		return $this->numRegistros;
	}
	public function getInfoError(){
		return $this->infoError;
	}
	public function setCodigoRecibo($core){
		$this->codigo_recibo = $core;
	}
	
	private function showError($declaracionPDO){
        $this->infoError =$declaracionPDO->errorInfo();
    }
	
	public function getEmpleadosEdificio(){
		$consulta = "SELECT cedula AS acedula ,nombre AS bNombre,direccion AS cDireccion,estado AS dEstado,".
		"ciudad AS eCiudad,telefono AS fTelefono,actividad AS gActividad,sueldo AS hSueldo FROM ".$this->tablaUno.
		" INNER JOIN ".$this->tablaJoinOne." ON ".$this->tablaUno.".id_estado = ".$this->tablaJoinOne.".id_estado ".
		"INNER JOIN ".$this->tablaJoinTwo." ON ".$this->tablaUno.".id_ciudad = ".$this->tablaJoinTwo.".id_ciudad  ".		
		"WHERE cod_edificio = :coe";
		$declaracionPDO = $this->conexion->prepare($consulta);
		$this->cod_edificio=htmlspecialchars(strip_tags($this->cod_edificio));
		$declaracionPDO->bindParam(':coe',$this->cod_edificio);
		if($declaracionPDO->execute()){  
			$numFilas = $declaracionPDO->rowCount();
            $fila = $declaracionPDO->fetchAll(PDO::FETCH_ASSOC);
			$this->registros = $fila;
			$this->numRegistros = $numFilas;	
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}
	}
	
	
	
	public function getPagosNominaMes(){
		$consulta = "SELECT cedula AS aCedula,nombre AS bNombre,fecha AS cFecha,recibo_numero AS dRecibo,".
		"concepto AS eConcepto,monto AS fMonto,tipo_pago AS gTipoPago,referencia AS hReferencia FROM "
		.$this->tablaDos." INNER JOIN ".$this->tablaUno." ON ".$this->tablaUno.".cedula = ".
		$this->tablaDos.".cedula "." WHERE cod_edificio = :coe AND codigo_recibo = :cor";
		$declaracionPDO = $this->conexion->prepare($consulta);
		$this->cod_edificio=htmlspecialchars(strip_tags($this->cod_edificio));
		$this->codigo_recibo=htmlspecialchars(strip_tags($this->codigo_recibo));
		$declaracionPDO->bindParam(':coe',$this->cod_edificio);
		$declaracionPDO->bindParam(':cor',$this->codigo_recibo);
		if($declaracionPDO->execute()){  
			$numFilas = $declaracionPDO->rowCount();
            $fila = $declaracionPDO->fetchAll(PDO::FETCH_ASSOC);
			$this->registros = $fila;
			$this->numRegistros = $numFilas;	
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}
	}
}



?>